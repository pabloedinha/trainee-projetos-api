const { getTeamState } = require("../data/store");

function toPublicProject(project) {
  const { teamId, ...projectWithoutTeam } = project;
  return projectWithoutTeam;
}

function findProjectRecord(teamId, projectId) {
  const state = getTeamState(teamId);
  return state.projects.find((project) => project.id === projectId) || null;
}

function listProjects(teamId) {
  const state = getTeamState(teamId);
  return state.projects.map(toPublicProject);
}

function getProjectById(teamId, projectId) {
  const project = findProjectRecord(teamId, projectId);
  return project ? toPublicProject(project) : null;
}

function createProject(teamId, payload) {
  const state = getTeamState(teamId);
  const newProject = {
    id: state.nextProjectId,
    teamId,
    name: payload.name.trim(),
    client: payload.client.trim(),
    description: payload.description.trim(),
    status: payload.status,
    progress: payload.progress,
    dueDate: payload.dueDate,
    owner: payload.owner.trim(),
    priority: payload.priority
  };

  state.projects.push(newProject);
  state.nextProjectId += 1;

  return {
    project: toPublicProject(newProject)
  };
}

function deleteProject(teamId, projectId) {
  const state = getTeamState(teamId);
  const projectIndex = state.projects.findIndex((project) => project.id === projectId);

  if (projectIndex === -1) {
    return {
      error: {
        message: "Projeto nao encontrado.",
        status: 404
      }
    };
  }

  state.projects.splice(projectIndex, 1);
  state.tasks = state.tasks.filter((task) => task.projectId !== projectId);

  return {
    success: true
  };
}

function projectBelongsToTeam(teamId, projectId) {
  return Boolean(findProjectRecord(teamId, projectId));
}

module.exports = {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  projectBelongsToTeam
};
