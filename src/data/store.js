const { createInitialStore } = require("../utils/cloneBaseData");

let store = createInitialStore();

function getTeamState(teamId) {
  return store[teamId];
}

function resetStore() {
  store = createInitialStore();
  return store;
}

module.exports = {
  getTeamState,
  resetStore
};
