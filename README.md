# API Trainee de Projetos

API em Node.js + Express para apoiar o trainee da area de Projetos da Inteli Junior. A aplicacao expoe projetos, tarefas e metricas de dashboard com isolamento por equipe via `x-team-token`.

## Requisitos

- Node.js 22+
- npm 11+

## Como rodar

```bash
npm install
npm start
```

Servidor padrao: `http://localhost:3000`

Documentacao Swagger: `http://localhost:3000/docs`

Para desenvolvimento com reload:

```bash
npm run dev
```

## Variaveis de ambiente

Arquivo [.env](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\.env):

```env
PORT=3000
NODE_ENV=development
```

Opcionalmente, os tokens podem ser sobrescritos com `TEAM_TOKENS_JSON`.

## Tokens disponiveis

- `equipe-alpha-2026`
- `equipe-beta-2026`
- `equipe-gamma-2026`
- `equipe-delta-2026`
- `equipe-epsilon-2026`

## Endpoints

Todos os endpoints abaixo exigem o header `x-team-token`, exceto `GET /health`, `GET /docs` e `GET /docs/openapi.json`.

- `GET /health`
- `GET /docs`
- `GET /docs/openapi.json`
- `GET /projects`
- `GET /projects/:id`
- `GET /tasks`
- `GET /tasks/:id`
- `GET /dashboard`
- `POST /tasks`
- `PATCH /tasks/:id/status`

## Filtros em tarefas

`GET /tasks` aceita:

- `projectId`
- `status`
- `priority`

Enums validos:

- Status de projeto: `Planejamento`, `Em andamento`, `Em revisão`, `Concluído`
- Status de tarefa: `A fazer`, `Em andamento`, `Em revisão`, `Concluída`
- Prioridade: `Baixa`, `Média`, `Alta`

## Exemplo de criacao de tarefa

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "x-team-token: equipe-alpha-2026" \
  -d '{
    "projectId": 1,
    "title": "Criar tela de dashboard",
    "description": "Desenvolver uma visao geral com metricas do projeto.",
    "status": "A fazer",
    "priority": "Média",
    "assignee": "Carlos Lima",
    "dueDate": "2026-04-18",
    "estimatedHours": 8
  }'
```

## Testes

Smoke tests cobrindo sucesso, validacao e isolamento entre equipes:

```bash
npm test
```

## Estrutura

- [src/app.js](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\app.js)
- [src/server.js](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\server.js)
- [src/data/baseProjects.json](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\data\baseProjects.json)
- [src/data/baseTasks.json](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\data\baseTasks.json)
- [src/middlewares/authTeamToken.js](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\middlewares\authTeamToken.js)
- [src/services/project.service.js](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\services\project.service.js)
- [src/services/task.service.js](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\services\task.service.js)
- [src/services/dashboard.service.js](C:\Users\Inteli\Documents\GitHub\inteli-junior\trainee-projetos-api\src\services\dashboard.service.js)
