require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { authTeamToken } = require("./middlewares/authTeamToken");
const openApiSpec = require("./docs/openapi");
const projectsRoutes = require("./routes/projects.routes");
const tasksRoutes = require("./routes/tasks.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "x-team-token"]
  })
);
app.use(express.json());

app.get("/docs/openapi.json", (req, res) => {
  return res.status(200).json(openApiSpec);
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: "API Trainee de Projetos - Swagger",
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use(authTeamToken);
app.use("/projects", projectsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: "Rota não encontrada." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({ message: "Erro interno do servidor." });
});

module.exports = app;
