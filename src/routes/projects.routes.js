const express = require("express");
const { getProjectById, listProjects } = require("../services/project.service");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json(listProjects(req.teamId));
});

router.get("/:id", (req, res) => {
  const projectId = Number(req.params.id);
  const project = getProjectById(req.teamId, projectId);

  if (!project) {
    return res.status(404).json({ message: "Projeto não encontrado." });
  }

  return res.status(200).json(project);
});

module.exports = router;
