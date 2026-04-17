const express = require("express");
const router = express.Router();

const {
  askQuestion,
  getAllQuestions,
  answerQuestion,
  getHealthFeed,
} = require("../controllers/Question.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

// Patient asks a question
router.post("/", protect, authorize("patient"), askQuestion);

// Doctor / Admin views all questions
router.get("/", protect, authorize("doctor", "admin"), getAllQuestions);

// Doctor answers a question
router.put("/:id/answer", protect, authorize("doctor"), answerQuestion);

module.exports = router;