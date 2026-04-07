const { TEAM_TOKENS } = require("../data/tokens");

function authTeamToken(req, res, next) {
  const teamToken = req.header("x-team-token");

  if (!teamToken) {
    return res.status(401).json({ message: "Header x-team-token não informado." });
  }

  const teamId = TEAM_TOKENS[teamToken];

  if (!teamId) {
    return res.status(403).json({ message: "Token de equipe inválido." });
  }

  req.teamId = teamId;
  return next();
}

module.exports = {
  authTeamToken
};
