const assert = require("node:assert/strict");
const app = require("../src/app");

const VALID_TOKEN = "equipe-alpha-2026";
const SECOND_TEAM_TOKEN = "equipe-beta-2026";

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${address.port}`,
        server
      });
    });
  });
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  return {
    data,
    status: response.status
  };
}

async function run() {
  const { baseUrl, server } = await startServer();

  try {
    let response = await request(baseUrl, "/docs/openapi.json");
    assert.equal(response.status, 200);
    assert.equal(response.data.info.title, "API Trainee de Projetos");
    assert.ok(response.data.paths["/projects"]);
    assert.ok(response.data.paths["/tasks"]);
    assert.ok(response.data.paths["/dashboard"]);
    assert.ok(response.data.paths["/projects"].post);
    assert.ok(response.data.paths["/projects/{id}"].delete);
    assert.ok(response.data.paths["/tasks/{id}"].delete);

    response = await request(baseUrl, "/docs/");
    assert.equal(response.status, 200);
    assert.match(response.data, /swagger-ui/i);

    response = await request(baseUrl, "/projects");
    assert.equal(response.status, 401);

    response = await request(baseUrl, "/projects", {
      headers: { "x-team-token": "token-invalido" }
    });
    assert.equal(response.status, 403);

    response = await request(baseUrl, "/projects", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.length, 5);

    response = await request(baseUrl, "/projects/1", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.id, 1);

    response = await request(baseUrl, "/tasks?projectId=1&status=Em%20andamento", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.data));
    assert.ok(response.data.every((task) => task.projectId === 1 && task.status === "Em andamento"));

    response = await request(baseUrl, "/tasks?priority=Urgente", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 400);

    response = await request(baseUrl, "/dashboard", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.totalProjects, 5);
    assert.equal(response.data.totalTasks, 20);

    response = await request(baseUrl, "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({
        projectId: 999,
        title: "Tarefa invalida",
        description: "Projeto inexistente",
        status: "A fazer",
        priority: "Média",
        assignee: "Tester",
        dueDate: "2026-04-18",
        estimatedHours: 2
      })
    });
    assert.equal(response.status, 404);

    response = await request(baseUrl, "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({
        projectId: 1,
        title: "Criar tela de dashboard",
        description: "Desenvolver uma visao geral com metricas do projeto.",
        status: "A fazer",
        priority: "Média",
        assignee: "Carlos Lima",
        dueDate: "2026-04-18",
        estimatedHours: 8
      })
    });
    assert.equal(response.status, 201);
    assert.equal(response.data.task.id, 121);

    response = await request(baseUrl, "/tasks/121", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.title, "Criar tela de dashboard");

    response = await request(baseUrl, "/tasks/121/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({ status: "Pronta" })
    });
    assert.equal(response.status, 400);

    response = await request(baseUrl, "/tasks/121/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({ status: "Concluída" })
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.task.status, "Concluída");

    response = await request(baseUrl, "/dashboard", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.totalTasks, 21);

    response = await request(baseUrl, "/tasks", {
      headers: { "x-team-token": SECOND_TEAM_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.length, 20);

    response = await request(baseUrl, "/tasks/121", {
      headers: { "x-team-token": SECOND_TEAM_TOKEN }
    });
    assert.equal(response.status, 404);

    response = await request(baseUrl, "/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({
        name: "Central de Operacoes",
        client: "Empresa Zeta",
        description: "Painel para acompanhar ocorrencias e indicadores operacionais.",
        status: "Planejamento",
        progress: 10,
        dueDate: "2026-05-12",
        owner: "Patricia Lima",
        priority: "Alta"
      })
    });
    assert.equal(response.status, 201);
    assert.equal(response.data.project.id, 6);

    response = await request(baseUrl, "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({
        projectId: 6,
        title: "Montar backlog inicial",
        description: "Estruturar as primeiras entregas do projeto.",
        status: "A fazer",
        priority: "Alta",
        assignee: "Bianca Alves",
        dueDate: "2026-04-25",
        estimatedHours: 5
      })
    });
    assert.equal(response.status, 201);
    assert.equal(response.data.task.id, 122);

    response = await request(baseUrl, "/tasks/122", {
      method: "DELETE",
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);

    response = await request(baseUrl, "/tasks/122", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 404);

    response = await request(baseUrl, "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-token": VALID_TOKEN
      },
      body: JSON.stringify({
        projectId: 6,
        title: "Definir indicadores",
        description: "Selecionar as metricas principais da operacao.",
        status: "A fazer",
        priority: "Baixa",
        assignee: "Caio Rocha",
        dueDate: "2026-04-28",
        estimatedHours: 3
      })
    });
    assert.equal(response.status, 201);
    assert.equal(response.data.task.id, 123);

    response = await request(baseUrl, "/projects/6", {
      method: "DELETE",
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);

    response = await request(baseUrl, "/projects/6", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 404);

    response = await request(baseUrl, "/tasks/123", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 404);

    response = await request(baseUrl, "/dashboard", {
      headers: { "x-team-token": VALID_TOKEN }
    });
    assert.equal(response.status, 200);
    assert.equal(response.data.totalProjects, 5);
    assert.equal(response.data.totalTasks, 21);

    console.log("Smoke tests executados com sucesso.");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
