const express = require("express");
const { getDashboard } = require("../services/dashboard.service");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json(getDashboard(req.teamId));
});

module.exports = router;
