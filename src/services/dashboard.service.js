const { getTeamState } = require("../data/store");
const { PROJECT_STATUSES, PRIORITIES, TASK_STATUSES } = require("../utils/validators");

function initializeCounter(values) {
  return values.reduce((counter, value) => {
    counter[value] = 0;
    return counter;
  }, {});
}

function getTodayDateString() {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDashboard(teamId) {
  const state = getTeamState(teamId);
  const today = getTodayDateString();

  const projectsByStatus = initializeCounter(PROJECT_STATUSES);
  const tasksByStatus = initializeCounter(TASK_STATUSES);

  for (const project of state.projects) {
    projectsByStatus[project.status] += 1;
  }

  for (const task of state.tasks) {
    tasksByStatus[task.status] += 1;
  }

  const overdueTasks = state.tasks.filter((task) => {
    return task.dueDate < today && task.status !== "Concluída";
  }).length;

  const highPriorityTasks = state.tasks.filter((task) => task.priority === PRIORITIES[2]).length;

  return {
    totalProjects: state.projects.length,
    projectsByStatus,
    totalTasks: state.tasks.length,
    tasksByStatus,
    overdueTasks,
    highPriorityTasks
  };
}

module.exports = {
  getDashboard
};
