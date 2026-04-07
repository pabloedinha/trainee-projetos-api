const DEFAULT_TEAM_TOKENS = {
  "equipe-alpha-2026": "alpha",
  "equipe-beta-2026": "beta",
  "equipe-gamma-2026": "gamma",
  "equipe-delta-2026": "delta",
  "equipe-epsilon-2026": "epsilon"
};

function loadTeamTokens() {
  if (!process.env.TEAM_TOKENS_JSON) {
    return DEFAULT_TEAM_TOKENS;
  }

  try {
    const parsed = JSON.parse(process.env.TEAM_TOKENS_JSON);
    const entries = Object.entries(parsed).filter(([token, teamId]) => {
      return typeof token === "string" && token.trim() && typeof teamId === "string" && teamId.trim();
    });

    if (entries.length === 0) {
      return DEFAULT_TEAM_TOKENS;
    }

    return Object.fromEntries(entries);
  } catch (error) {
    return DEFAULT_TEAM_TOKENS;
  }
}

const TEAM_TOKENS = loadTeamTokens();
const TEAM_IDS = [...new Set(Object.values(TEAM_TOKENS))];

module.exports = {
  TEAM_IDS,
  TEAM_TOKENS
};
