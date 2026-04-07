const { PRIORITIES, PROJECT_STATUSES, TASK_STATUSES } = require("../utils/validators");

const exampleProject = {
  id: 1,
  name: "Portal do Cliente",
  client: "Empresa Alpha",
  description: "Criacao de um portal para acompanhamento de solicitacoes e historico do cliente.",
  status: PROJECT_STATUSES[1],
  progress: 65,
  dueDate: "2026-04-20",
  owner: "Mariana Costa",
  priority: PRIORITIES[2]
};

const exampleTask = {
  id: 101,
  projectId: 1,
  title: "Criar tela de login",
  description: "Desenvolver a interface inicial de autenticacao.",
  status: TASK_STATUSES[3],
  priority: PRIORITIES[2],
  assignee: "Joao Pedro",
  dueDate: "2026-04-05",
  estimatedHours: 6
};

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "API Trainee de Projetos",
    version: "1.0.0",
    description: "Documentacao da API de apoio ao processo trainee da area de Projetos da Inteli Junior."
  },
  servers: [
    {
      url: "/",
      description: "Servidor atual"
    }
  ],
  tags: [
    {
      name: "Health",
      description: "Rotas publicas de verificacao da aplicacao"
    },
    {
      name: "Projects",
      description: "Consulta dos projetos disponiveis para a equipe autenticada"
    },
    {
      name: "Tasks",
      description: "Consulta e manipulacao das tarefas da equipe autenticada"
    },
    {
      name: "Dashboard",
      description: "Metricas consolidadas por equipe"
    }
  ],
  security: [
    {
      TeamTokenAuth: []
    }
  ],
  components: {
    securitySchemes: {
      TeamTokenAuth: {
        type: "apiKey",
        in: "header",
        name: "x-team-token",
        description: "Token da equipe. Exemplo: equipe-alpha-2026"
      }
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "ok"
          }
        },
        required: ["status"]
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Rota nao encontrada."
          }
        },
        required: ["message"]
      },
      Project: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: exampleProject.id
          },
          name: {
            type: "string",
            example: exampleProject.name
          },
          client: {
            type: "string",
            example: exampleProject.client
          },
          description: {
            type: "string",
            example: exampleProject.description
          },
          status: {
            type: "string",
            enum: PROJECT_STATUSES,
            example: exampleProject.status
          },
          progress: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            example: exampleProject.progress
          },
          dueDate: {
            type: "string",
            format: "date",
            example: exampleProject.dueDate
          },
          owner: {
            type: "string",
            example: exampleProject.owner
          },
          priority: {
            type: "string",
            enum: PRIORITIES,
            example: exampleProject.priority
          }
        },
        required: [
          "id",
          "name",
          "client",
          "description",
          "status",
          "progress",
          "dueDate",
          "owner",
          "priority"
        ]
      },
      Task: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: exampleTask.id
          },
          projectId: {
            type: "integer",
            example: exampleTask.projectId
          },
          title: {
            type: "string",
            example: exampleTask.title
          },
          description: {
            type: "string",
            example: exampleTask.description
          },
          status: {
            type: "string",
            enum: TASK_STATUSES,
            example: exampleTask.status
          },
          priority: {
            type: "string",
            enum: PRIORITIES,
            example: exampleTask.priority
          },
          assignee: {
            type: "string",
            example: exampleTask.assignee
          },
          dueDate: {
            type: "string",
            format: "date",
            example: exampleTask.dueDate
          },
          estimatedHours: {
            type: "number",
            example: exampleTask.estimatedHours
          }
        },
        required: [
          "id",
          "projectId",
          "title",
          "description",
          "status",
          "priority",
          "assignee",
          "dueDate",
          "estimatedHours"
        ]
      },
      CreateTaskRequest: {
        type: "object",
        properties: {
          projectId: {
            type: "integer",
            example: exampleTask.projectId
          },
          title: {
            type: "string",
            example: "Criar tela de dashboard"
          },
          description: {
            type: "string",
            example: "Desenvolver uma visao geral com metricas do projeto."
          },
          status: {
            type: "string",
            enum: TASK_STATUSES,
            example: TASK_STATUSES[0]
          },
          priority: {
            type: "string",
            enum: PRIORITIES,
            example: PRIORITIES[1]
          },
          assignee: {
            type: "string",
            example: "Carlos Lima"
          },
          dueDate: {
            type: "string",
            format: "date",
            example: "2026-04-18"
          },
          estimatedHours: {
            type: "number",
            example: 8
          }
        },
        required: [
          "projectId",
          "title",
          "description",
          "status",
          "priority",
          "assignee",
          "dueDate",
          "estimatedHours"
        ]
      },
      CreateTaskResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Tarefa criada com sucesso."
          },
          task: {
            $ref: "#/components/schemas/Task"
          }
        },
        required: ["message", "task"]
      },
      UpdateTaskStatusRequest: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: TASK_STATUSES,
            example: TASK_STATUSES[2]
          }
        },
        required: ["status"]
      },
      UpdateTaskStatusResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Status atualizado com sucesso."
          },
          task: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: exampleTask.id
              },
              status: {
                type: "string",
                enum: TASK_STATUSES,
                example: TASK_STATUSES[3]
              }
            },
            required: ["id", "status"]
          }
        },
        required: ["message", "task"]
      },
      Dashboard: {
        type: "object",
        properties: {
          totalProjects: {
            type: "integer",
            example: 5
          },
          projectsByStatus: {
            type: "object",
            additionalProperties: {
              type: "integer"
            },
            example: {
              [PROJECT_STATUSES[0]]: 1,
              [PROJECT_STATUSES[1]]: 2,
              [PROJECT_STATUSES[2]]: 1,
              [PROJECT_STATUSES[3]]: 1
            }
          },
          totalTasks: {
            type: "integer",
            example: 20
          },
          tasksByStatus: {
            type: "object",
            additionalProperties: {
              type: "integer"
            },
            example: {
              [TASK_STATUSES[0]]: 6,
              [TASK_STATUSES[1]]: 7,
              [TASK_STATUSES[2]]: 4,
              [TASK_STATUSES[3]]: 3
            }
          },
          overdueTasks: {
            type: "integer",
            example: 4
          },
          highPriorityTasks: {
            type: "integer",
            example: 8
          }
        },
        required: [
          "totalProjects",
          "projectsByStatus",
          "totalTasks",
          "tasksByStatus",
          "overdueTasks",
          "highPriorityTasks"
        ]
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica se a API esta online",
        security: [],
        responses: {
          200: {
            description: "API disponivel",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse"
                }
              }
            }
          }
        }
      }
    },
    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "Lista todos os projetos da equipe",
        responses: {
          200: {
            description: "Projetos retornados com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Project"
                  }
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/projects/{id}": {
      get: {
        tags: ["Projects"],
        summary: "Busca um projeto pelo id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            },
            description: "Identificador do projeto"
          }
        ],
        responses: {
          200: {
            description: "Projeto encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Project"
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          404: {
            description: "Projeto nao encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Lista tarefas com filtros opcionais",
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: false,
            schema: {
              type: "integer"
            },
            description: "Filtra pelo id do projeto"
          },
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: TASK_STATUSES
            },
            description: "Filtra pelo status da tarefa"
          },
          {
            name: "priority",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: PRIORITIES
            },
            description: "Filtra pela prioridade da tarefa"
          }
        ],
        responses: {
          200: {
            description: "Tarefas retornadas com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Task"
                  }
                }
              }
            }
          },
          400: {
            description: "Filtros invalidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Tasks"],
        summary: "Cria uma nova tarefa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTaskRequest"
              }
            }
          }
        },
        responses: {
          201: {
            description: "Tarefa criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateTaskResponse"
                }
              }
            }
          },
          400: {
            description: "Payload invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          404: {
            description: "Projeto nao encontrado para a equipe",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Busca uma tarefa pelo id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            },
            description: "Identificador da tarefa"
          }
        ],
        responses: {
          200: {
            description: "Tarefa encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task"
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          404: {
            description: "Tarefa nao encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/tasks/{id}/status": {
      patch: {
        tags: ["Tasks"],
        summary: "Atualiza somente o status de uma tarefa",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            },
            description: "Identificador da tarefa"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTaskStatusRequest"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Status atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateTaskStatusResponse"
                }
              }
            }
          },
          400: {
            description: "Status invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          404: {
            description: "Tarefa nao encontrada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Retorna o resumo do dashboard da equipe",
        responses: {
          200: {
            description: "Metricas retornadas com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Dashboard"
                }
              }
            }
          },
          401: {
            description: "Header x-team-token nao informado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          403: {
            description: "Token de equipe invalido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = openApiSpec;
