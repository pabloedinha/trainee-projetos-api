const express = require("express");
const {
  validateTaskFilters,
  validateTaskPayload,
  validateTaskStatusPayload
} = require("../utils/validators");
const {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTaskStatus
} = require("../services/task.service");

const router = express.Router();

router.get("/", (req, res) => {
  const validation = validateTaskFilters(req.query);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  return res.status(200).json(listTasks(req.teamId, req.query));
});

router.get("/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = getTaskById(req.teamId, taskId);

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }

  return res.status(200).json(task);
});

router.post("/", (req, res) => {
  if (!validateTaskPayload(req.body)) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes ou inválidos." });
  }

  const result = createTask(req.teamId, req.body);

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(201).json({
    message: "Tarefa criada com sucesso.",
    task: result.task
  });
});

router.delete("/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const result = deleteTask(req.teamId, taskId);

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json({ message: "Tarefa removida com sucesso." });
});

router.patch("/:id/status", (req, res) => {
  if (!validateTaskStatusPayload(req.body)) {
    return res.status(400).json({ message: "Status inválido." });
  }

  const taskId = Number(req.params.id);
  const result = updateTaskStatus(req.teamId, taskId, req.body.status);

  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  return res.status(200).json({
    message: "Status atualizado com sucesso.",
    task: {
      id: result.task.id,
      status: result.task.status
    }
  });
});

module.exports = router;
