# Plano de Implementação da API — Trainee de Projetos (Inteli Júnior)

## 1. Objetivo da API

Esta API será utilizada no processo trainee da área de Projetos da Inteli Júnior. Ela deve permitir que as equipes desenvolvam o frontend de uma aplicação web de gestão de projetos consumindo dados reais e realizando algumas interações básicas.

A API precisa ser:

- simples o suficiente para ser consumida por trainees iniciantes
- rica o suficiente para diferenciar equipes que pensam produto, organização e interação
- isolada por equipe, para impedir interferência entre grupos
- rápida de implementar e fácil de manter durante o período do trainee

---

## 2. Objetivos funcionais

A API deve permitir que os trainees construam, no mínimo:

- uma tela de listagem geral de projetos ou dashboard
- uma tela de detalhe
- navegação entre telas
- visualização de dados reais
- diferenciais como dashboard, filtros, atualização de status e criação de tarefas

### Funcionalidades obrigatórias da API
- listar projetos da equipe
- obter detalhes de um projeto
- listar tarefas da equipe
- obter detalhes de uma tarefa
- filtrar tarefas por projeto, status e prioridade
- retornar métricas prontas de dashboard
- criar tarefa
- atualizar status de tarefa

---

## 3. Decisões arquiteturais recomendadas

### Stack sugerida
Para implementar de forma rápida e confiável, a recomendação é:

- **Node.js**
- **Express**
- **CORS**
- **UUID** ou contador incremental para IDs de tarefas
- armazenamento em memória ou JSON local, já que o escopo é temporário e controlado

### Persistência recomendada
Para o trainee, existem 3 caminhos possíveis:

#### Opção A — Memória (mais simples)
- dados carregados ao iniciar o servidor
- alterações existem apenas enquanto o servidor estiver ligado

**Vantagens**
- extremamente rápido de implementar
- ótimo para validação do case

**Desvantagens**
- reiniciar o servidor apaga alterações

#### Opção B — JSON local (recomendado)
- manter arquivos JSON com dataset base
- ao iniciar, clonar o dataset por equipe
- opcionalmente persistir alterações em arquivos separados

**Vantagens**
- simples
- mais previsível
- pode manter dados mesmo após reinício, se desejar

#### Opção C — Banco de dados
- SQLite, PostgreSQL ou MongoDB

**Vantagens**
- mais robusto

**Desvantagens**
- esforço desnecessário para este caso

### Recomendação final
Usar **Express + JSON local ou memória**.

---

## 4. Regras de negócio principais

### 4.1 Isolamento por equipe
Todas as equipes usam a mesma API base, mas cada uma acessa apenas seus próprios dados por meio de um token fixo enviado no header:

```http
x-team-token: equipe-alpha-2026
```

### 4.2 Mesmo dataset inicial
Todas as equipes começam com o mesmo conjunto inicial de:

- 5 projetos
- 20 tarefas

A única diferença é o identificador interno da equipe.

### 4.3 Escrita limitada ao escopo da equipe
Uma equipe só pode:

- listar seus próprios projetos
- listar suas próprias tarefas
- criar tarefas nos seus próprios projetos
- atualizar tarefas da sua própria equipe

### 4.4 Sem autenticação complexa
O token fixo será suficiente. Não há necessidade de login, usuário ou sessão.

---

## 5. Tokens por equipe

Criar uma lista fixa de tokens válidos. Exemplo:

```json
{
  "equipe-alpha-2026": "alpha",
  "equipe-beta-2026": "beta",
  "equipe-gamma-2026": "gamma",
  "equipe-delta-2026": "delta",
  "equipe-epsilon-2026": "epsilon"
}
```

### Regras
- se não houver `x-team-token`, retornar `401 Unauthorized`
- se o token for inválido, retornar `403 Forbidden`

---

## 6. Modelagem de dados

### 6.1 Projeto

```json
{
  "id": 1,
  "teamId": "alpha",
  "name": "Portal do Cliente",
  "client": "Empresa Alpha",
  "description": "Criação de um portal para acompanhamento de solicitações e histórico do cliente.",
  "status": "Em andamento",
  "progress": 65,
  "dueDate": "2026-04-20",
  "owner": "Mariana Costa",
  "priority": "Alta"
}
```

### Campos
- `id`: número inteiro
- `teamId`: identificador interno da equipe
- `name`: nome do projeto
- `client`: nome do cliente
- `description`: descrição curta
- `status`: status do projeto
- `progress`: progresso de 0 a 100
- `dueDate`: data limite no formato `YYYY-MM-DD`
- `owner`: responsável principal
- `priority`: prioridade

### 6.2 Tarefa

```json
{
  "id": 101,
  "teamId": "alpha",
  "projectId": 1,
  "title": "Criar tela de login",
  "description": "Desenvolver a interface inicial de autenticação.",
  "status": "Concluída",
  "priority": "Alta",
  "assignee": "João Pedro",
  "dueDate": "2026-04-05",
  "estimatedHours": 6
}
```

### Campos
- `id`: número inteiro
- `teamId`: identificador da equipe
- `projectId`: ID do projeto relacionado
- `title`: título da tarefa
- `description`: descrição da tarefa
- `status`: status da tarefa
- `priority`: prioridade
- `assignee`: responsável
- `dueDate`: data limite
- `estimatedHours`: esforço estimado em horas

---

## 7. Enums e validações

### 7.1 Status de projeto
Valores válidos:
- `Planejamento`
- `Em andamento`
- `Em revisão`
- `Concluído`

### 7.2 Status de tarefa
Valores válidos:
- `A fazer`
- `Em andamento`
- `Em revisão`
- `Concluída`

### 7.3 Prioridade
Valores válidos:
- `Baixa`
- `Média`
- `Alta`

### Validações obrigatórias
- `progress` entre 0 e 100
- `dueDate` no formato válido
- `projectId` deve existir dentro da equipe
- `status` e `priority` devem pertencer aos enums válidos
- `estimatedHours` deve ser numérico e maior que 0

---

## 8. Mapeamento de rotas

### 8.1 GET /projects
Retorna todos os projetos da equipe autenticada pelo token.

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
```

#### Response — 200 OK
```json
[
  {
    "id": 1,
    "name": "Portal do Cliente",
    "client": "Empresa Alpha",
    "description": "Criação de um portal para acompanhamento de solicitações e histórico do cliente.",
    "status": "Em andamento",
    "progress": 65,
    "dueDate": "2026-04-20",
    "owner": "Mariana Costa",
    "priority": "Alta"
  },
  {
    "id": 2,
    "name": "Dashboard Comercial",
    "client": "Empresa Beta",
    "description": "Dashboard para acompanhamento de vendas e metas.",
    "status": "Planejamento",
    "progress": 20,
    "dueDate": "2026-05-10",
    "owner": "Lucas Lima",
    "priority": "Média"
  }
]
```

#### Erros
**401 Unauthorized**
```json
{ "message": "Header x-team-token não informado." }
```

**403 Forbidden**
```json
{ "message": "Token de equipe inválido." }
```

---

### 8.2 GET /projects/:id
Retorna detalhes de um projeto da equipe.

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
```

#### Response — 200 OK
```json
{
  "id": 1,
  "name": "Portal do Cliente",
  "client": "Empresa Alpha",
  "description": "Criação de um portal para acompanhamento de solicitações e histórico do cliente.",
  "status": "Em andamento",
  "progress": 65,
  "dueDate": "2026-04-20",
  "owner": "Mariana Costa",
  "priority": "Alta"
}
```

#### Erros
**404 Not Found**
```json
{ "message": "Projeto não encontrado." }
```

---

### 8.3 GET /tasks
Retorna tarefas da equipe. Pode aceitar filtros opcionais.

#### Query params opcionais
- `projectId`
- `status`
- `priority`

#### Exemplos
```http
GET /tasks
GET /tasks?projectId=1
GET /tasks?status=Em andamento
GET /tasks?priority=Alta
GET /tasks?projectId=1&status=Em andamento
```

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
```

#### Response — 200 OK
```json
[
  {
    "id": 101,
    "projectId": 1,
    "title": "Criar tela de login",
    "description": "Desenvolver a interface inicial de autenticação.",
    "status": "Concluída",
    "priority": "Alta",
    "assignee": "João Pedro",
    "dueDate": "2026-04-05",
    "estimatedHours": 6
  },
  {
    "id": 102,
    "projectId": 1,
    "title": "Implementar listagem de solicitações",
    "description": "Exibir dados vindos da API em formato de tabela.",
    "status": "Em andamento",
    "priority": "Alta",
    "assignee": "Ana Souza",
    "dueDate": "2026-04-12",
    "estimatedHours": 10
  }
]
```

#### Comportamento recomendado
- se filtro não existir, retornar array vazio
- se filtro for inválido, pode retornar `400 Bad Request`

---

### 8.4 GET /tasks/:id
Retorna detalhes de uma tarefa da equipe.

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
```

#### Response — 200 OK
```json
{
  "id": 102,
  "projectId": 1,
  "title": "Implementar listagem de solicitações",
  "description": "Exibir dados vindos da API em formato de tabela.",
  "status": "Em andamento",
  "priority": "Alta",
  "assignee": "Ana Souza",
  "dueDate": "2026-04-12",
  "estimatedHours": 10
}
```

#### Erros
**404 Not Found**
```json
{ "message": "Tarefa não encontrada." }
```

---

### 8.5 GET /dashboard
Retorna métricas agregadas da equipe, já prontas para uso no frontend.

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
```

#### Response — 200 OK
```json
{
  "totalProjects": 5,
  "projectsByStatus": {
    "Planejamento": 1,
    "Em andamento": 2,
    "Em revisão": 1,
    "Concluído": 1
  },
  "totalTasks": 20,
  "tasksByStatus": {
    "A fazer": 6,
    "Em andamento": 7,
    "Em revisão": 3,
    "Concluída": 4
  },
  "overdueTasks": 2,
  "highPriorityTasks": 8
}
```

#### Lógica de cálculo recomendada
- `totalProjects`: total de projetos da equipe
- `projectsByStatus`: agrupamento por status
- `totalTasks`: total de tarefas da equipe
- `tasksByStatus`: agrupamento por status
- `overdueTasks`: tarefas com `dueDate` anterior à data atual e ainda não concluídas
- `highPriorityTasks`: tarefas com prioridade `Alta`

---

### 8.6 POST /tasks
Cria uma nova tarefa dentro de um projeto da equipe.

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
Content-Type: application/json
```

**Body**
```json
{
  "projectId": 1,
  "title": "Criar tela de dashboard",
  "description": "Desenvolver uma visão geral com métricas do projeto.",
  "status": "A fazer",
  "priority": "Média",
  "assignee": "Carlos Lima",
  "dueDate": "2026-04-18",
  "estimatedHours": 8
}
```

#### Regras
- todos os campos são obrigatórios
- `projectId` deve existir e pertencer à equipe
- `status` deve ser válido
- `priority` deve ser válido

#### Response — 201 Created
```json
{
  "message": "Tarefa criada com sucesso.",
  "task": {
    "id": 121,
    "projectId": 1,
    "title": "Criar tela de dashboard",
    "description": "Desenvolver uma visão geral com métricas do projeto.",
    "status": "A fazer",
    "priority": "Média",
    "assignee": "Carlos Lima",
    "dueDate": "2026-04-18",
    "estimatedHours": 8
  }
}
```

#### Erros
**400 Bad Request**
```json
{ "message": "Campos obrigatórios ausentes ou inválidos." }
```

**404 Not Found**
```json
{ "message": "Projeto não encontrado para esta equipe." }
```

---

### 8.7 PATCH /tasks/:id/status
Atualiza apenas o status de uma tarefa.

#### Request
**Headers**
```http
x-team-token: equipe-alpha-2026
Content-Type: application/json
```

**Body**
```json
{
  "status": "Concluída"
}
```

#### Response — 200 OK
```json
{
  "message": "Status atualizado com sucesso.",
  "task": {
    "id": 102,
    "status": "Concluída"
  }
}
```

#### Erros
**400 Bad Request**
```json
{ "message": "Status inválido." }
```

**404 Not Found**
```json
{ "message": "Tarefa não encontrada." }
```

---

## 9. Dataset inicial

### 9.1 Quantidade
Cada equipe começa com:
- 5 projetos
- 20 tarefas

### 9.2 Projetos sugeridos
1. Portal do Cliente
2. Dashboard Comercial
3. App de Agendamentos
4. Sistema Interno de RH
5. Plataforma de Suporte

### 9.3 Distribuição de status sugerida
#### Projetos
- 1 em `Planejamento`
- 2 em `Em andamento`
- 1 em `Em revisão`
- 1 em `Concluído`

#### Tarefas
- mistura entre `A fazer`, `Em andamento`, `Em revisão` e `Concluída`

### 9.4 Estratégia de inicialização
Criar um dataset base sem `teamId` e, na inicialização do servidor:
- clonar os dados para cada equipe
- anexar `teamId` correspondente
- manter tudo em memória ou em estrutura persistida

---

## 10. Estrutura de pastas sugerida

```text
api-trainee-projetos/
├── src/
│   ├── data/
│   │   ├── baseProjects.json
│   │   ├── baseTasks.json
│   │   └── tokens.js
│   ├── middlewares/
│   │   └── authTeamToken.js
│   ├── routes/
│   │   ├── projects.routes.js
│   │   ├── tasks.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   ├── project.service.js
│   │   ├── task.service.js
│   │   └── dashboard.service.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── cloneBaseData.js
│   ├── app.js
│   └── server.js
├── package.json
├── .env
└── README.md
```

---

## 11. Middleware necessário

### 11.1 Middleware de autenticação por token
Responsabilidades:
- ler `x-team-token`
- validar se existe
- validar se é um token conhecido
- anexar `req.teamId` à requisição

### Comportamento
- token ausente → `401`
- token inválido → `403`

---

## 12. Serviços recomendados

### 12.1 Serviço de projetos
Responsável por:
- listar projetos da equipe
- buscar projeto por ID
- validar se um projeto pertence à equipe

### 12.2 Serviço de tarefas
Responsável por:
- listar tarefas da equipe
- aplicar filtros
- buscar tarefa por ID
- criar tarefa
- atualizar status
- validar dados

### 12.3 Serviço de dashboard
Responsável por:
- calcular totais
- agrupar por status
- calcular atrasadas
- calcular alta prioridade

---

## 13. Validações detalhadas

### 13.1 POST /tasks
Validar:
- `projectId` obrigatório
- `title` obrigatório e não vazio
- `description` obrigatória
- `status` obrigatório e válido
- `priority` obrigatória e válida
- `assignee` obrigatório
- `dueDate` obrigatório e em formato válido
- `estimatedHours` obrigatório, numérico e > 0

### 13.2 PATCH /tasks/:id/status
Validar:
- body com `status`
- status dentro dos valores permitidos

---

## 14. Códigos HTTP recomendados

- `200 OK` para leituras e atualizações bem-sucedidas
- `201 Created` para criação de tarefa
- `400 Bad Request` para payload inválido
- `401 Unauthorized` para ausência de token
- `403 Forbidden` para token inválido
- `404 Not Found` para recurso inexistente ou fora da equipe
- `500 Internal Server Error` para erros inesperados

---

## 15. CORS e acesso do frontend

### Recomendação
Habilitar CORS para facilitar o consumo por qualquer stack frontend.

### Configuração mínima
- aceitar `GET`, `POST`, `PATCH`
- aceitar header `Content-Type`
- aceitar header `x-team-token`

---

## 16. Deploy recomendado

Para deploy rápido, opções boas:
- Render
- Railway
- Vercel Serverless Functions
- AWS, se desejar mais controle

### Recomendação prática
Usar **Render** ou **Railway** por simplicidade.

---

## 17. Variáveis de ambiente sugeridas

```env
PORT=3000
NODE_ENV=production
```

Se quiser permitir configuração externa de tokens:
```env
TEAM_TOKENS_JSON={"equipe-alpha-2026":"alpha","equipe-beta-2026":"beta"}
```

Mas, para este caso, pode manter hardcoded.

---

## 18. Testes mínimos antes de liberar para os trainees

Antes do kickoff, validar manualmente:

### Fluxo 1
- token válido
- `GET /projects`

### Fluxo 2
- `GET /projects/:id`

### Fluxo 3
- `GET /tasks?projectId=1`

### Fluxo 4
- `GET /dashboard`

### Fluxo 5
- `POST /tasks`

### Fluxo 6
- `PATCH /tasks/:id/status`

### Fluxo 7
- token inválido

### Fluxo 8
- token ausente

### Fluxo 9
- `projectId` inválido em `POST /tasks`

### Fluxo 10
- `status` inválido em `PATCH /tasks/:id/status`

---

## 19. Checklist de implementação

### Etapa 1 — Setup do projeto
- [ ] criar projeto Node.js
- [ ] instalar Express e CORS
- [ ] configurar estrutura de pastas
- [ ] configurar servidor

### Etapa 2 — Dados
- [ ] criar dataset base de projetos
- [ ] criar dataset base de tarefas
- [ ] criar mapa de tokens válidos
- [ ] criar rotina para clonar dataset por equipe

### Etapa 3 — Middleware
- [ ] implementar middleware de autenticação por `x-team-token`

### Etapa 4 — Rotas
- [ ] implementar `GET /projects`
- [ ] implementar `GET /projects/:id`
- [ ] implementar `GET /tasks`
- [ ] implementar `GET /tasks/:id`
- [ ] implementar `GET /dashboard`
- [ ] implementar `POST /tasks`
- [ ] implementar `PATCH /tasks/:id/status`

### Etapa 5 — Validações
- [ ] validar enums
- [ ] validar datas
- [ ] validar pertencimento da equipe
- [ ] validar payloads obrigatórios

### Etapa 6 — Testes
- [ ] testar todos os endpoints
- [ ] testar isolamento por equipe
- [ ] testar respostas de erro

### Etapa 7 — Deploy
- [ ] subir em ambiente hospedado
- [ ] testar URL pública
- [ ] validar CORS
- [ ] preparar documentação final para os trainees

---

## 20. Documentação para fornecer aos trainees

Além da API pronta, o ideal é fornecer para eles:

- URL base da API
- token da equipe
- lista de endpoints
- formato dos requests
- formato das responses
- observação de que o consumo real da API é obrigatório

---

## 21. Escopo final resumido

### Obrigatório na implementação
- autenticação por token de equipe
- isolamento de dados por equipe
- listagem e detalhe de projetos
- listagem e detalhe de tarefas
- filtros em tarefas
- dashboard agregado
- criação de tarefa
- atualização de status de tarefa

### Não obrigatório
- banco de dados real
- autenticação de usuário
- tratamento avançado de erros
- logs complexos
- paginação

---

## 22. Recomendação final de implementação

A forma mais eficiente de construir esta API é:

1. montar datasets base em JSON
2. criar um servidor Express
3. validar o token por middleware
4. anexar `teamId` na requisição
5. filtrar todos os dados por equipe
6. expor as 7 rotas principais
7. testar manualmente antes do processo trainee

Esse caminho é simples, rápido e suficiente para o objetivo do desafio.
