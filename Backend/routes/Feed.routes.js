const express = require("express");
const router = express.Router();

const { getHealthFeed } = require("../controllers/Question.controller");

// Public route — no authentication required
router.get("/", getHealthFeed);

module.exports = router;