const baseProjects = require("../data/baseProjects.json");
const baseTasks = require("../data/baseTasks.json");
const { TEAM_IDS } = require("../data/tokens");

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function attachTeamId(records, teamId) {
  return records.map((record) => ({
    ...deepClone(record),
    teamId
  }));
}

function getInitialNextTaskId() {
  return baseTasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
}

function getInitialNextProjectId() {
  return baseProjects.reduce((maxId, project) => Math.max(maxId, project.id), 0) + 1;
}

function createInitialStore() {
  return TEAM_IDS.reduce((store, teamId) => {
    store[teamId] = {
      projects: attachTeamId(baseProjects, teamId),
      tasks: attachTeamId(baseTasks, teamId),
      nextProjectId: getInitialNextProjectId(),
      nextTaskId: getInitialNextTaskId()
    };

    return store;
  }, {});
}

module.exports = {
  createInitialStore
};
