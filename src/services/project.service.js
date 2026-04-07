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

function projectBelongsToTeam(teamId, projectId) {
  return Boolean(findProjectRecord(teamId, projectId));
}

module.exports = {
  getProjectById,
  listProjects,
  projectBelongsToTeam
};
