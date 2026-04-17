const questionService = require("../services/Question.service");

const askQuestion = async (req, res) => {
  try {
    const { subject, category, body } = req.body;
    if (!body) return res.status(400).json({ message: "question text is required" });

    const result = await questionService.askQuestion(req.user._id, subject, category, body);
    res.status(201).json({ message: "Question submitted", question: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ message: "answer is required" });

    const question = await questionService.answerQuestion(req.params.id, req.user._id, answer);
    res.json({ message: "Question answered", question });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getHealthFeed = async (req, res) => {
  try {
    const feed = await questionService.getHealthFeed();
    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { askQuestion, getAllQuestions, answerQuestion, getHealthFeed };