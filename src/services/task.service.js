const { getTeamState } = require("../data/store");
const { projectBelongsToTeam } = require("./project.service");

function toPublicTask(task) {
  const { teamId, ...taskWithoutTeam } = task;
  return taskWithoutTeam;
}

function findTaskRecord(teamId, taskId) {
  const state = getTeamState(teamId);
  return state.tasks.find((task) => task.id === taskId) || null;
}

function listTasks(teamId, filters = {}) {
  const state = getTeamState(teamId);

  return state.tasks
    .filter((task) => {
      if (filters.projectId !== undefined && task.projectId !== Number(filters.projectId)) {
        return false;
      }

      if (filters.status !== undefined && task.status !== filters.status) {
        return false;
      }

      if (filters.priority !== undefined && task.priority !== filters.priority) {
        return false;
      }

      return true;
    })
    .map(toPublicTask);
}

function getTaskById(teamId, taskId) {
  const task = findTaskRecord(teamId, taskId);
  return task ? toPublicTask(task) : null;
}

function createTask(teamId, payload) {
  if (!projectBelongsToTeam(teamId, payload.projectId)) {
    return {
      error: {
        message: "Projeto não encontrado para esta equipe.",
        status: 404
      }
    };
  }

  const state = getTeamState(teamId);
  const newTask = {
    id: state.nextTaskId,
    teamId,
    projectId: payload.projectId,
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: payload.status,
    priority: payload.priority,
    assignee: payload.assignee.trim(),
    dueDate: payload.dueDate,
    estimatedHours: payload.estimatedHours
  };

  state.tasks.push(newTask);
  state.nextTaskId += 1;

  return {
    task: toPublicTask(newTask)
  };
}

function updateTaskStatus(teamId, taskId, status) {
  const task = findTaskRecord(teamId, taskId);

  if (!task) {
    return {
      error: {
        message: "Tarefa não encontrada.",
        status: 404
      }
    };
  }

  task.status = status;

  return {
    task: toPublicTask(task)
  };
}

function deleteTask(teamId, taskId) {
  const state = getTeamState(teamId);
  const taskIndex = state.tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return {
      error: {
        message: "Tarefa nao encontrada.",
        status: 404
      }
    };
  }

  state.tasks.splice(taskIndex, 1);

  return {
    success: true
  };
}

module.exports = {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTaskStatus
};
