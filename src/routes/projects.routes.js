const express = require("express");
const { validateProjectPayload } = require("../utils/validators");
const {
  createProject,
  deleteProject,
  getProjectById,
  listProjects
} = require("../services/project.service");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json(listProjects(req.teamId));
});

router.post("/", (req, res) => {
  if (!validateProjectPayload(req.body)) {
    return res.status(400).json({ message: "Campos obrigatorios ausentes ou invalidos." });
  }

  const result = createProject(req.teamId, req.body);

  return res.status(201).json({
    message: "Projeto criado com sucesso.",
    project: result.project
  });
});

router.get("/:id", (req, res) => {
  const projectId = Number(req.params.id);
  const project = getProjectById(req.teamId, projectId);

  if (!project) {
    return res.status(404).json({ message: "Projeto não encontrado." });
  }

  return res.status(200).json(project);
});

router.delete("/:id", (req, res) => {
  const projectId = Number(req.params.id);
  const result = deleteProject(req.teamId, projectId);

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json({ message: "Projeto removido com sucesso." });
});

module.exports = router;
