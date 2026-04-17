const Question = require("../models/question.model");
const Notification = require("../models/Notification.model"); // your existing model

// Patient posts a question
const askQuestion = async (patientId, subject, category, questionText) => {
  const question = await Question.create({
    patient: patientId,
    subject,
    category,
    question: questionText,
    status: "pending",
  });
  return question;
};

// Get all questions (admin/doctor can view all; filtered by status optionally)
const getAllQuestions = async () => {
  return await Question.find()
    .populate("patient", "name email")
    .populate("doctor", "name email")
    .sort({ createdAt: -1 });
};

// Doctor answers a question
const answerQuestion = async (questionId, doctorId, answerText) => {
  const question = await Question.findById(questionId);
  if (!question) throw new Error("Question not found");
  if (question.status === "answered") throw new Error("Question already answered");

  question.answer = answerText;
  question.doctor = doctorId;
  question.status = "answered";
  await question.save();

  // Notify patient
  await Notification.create({
    user: question.patient,
    title: "Question Answered",
    message: `Your question has been answered by a doctor.`,
    type: "system",
  });

  return question;
};

// Public health feed – only answered questions, latest first
const getHealthFeed = async () => {
  return await Question.find({ status: "answered" })
    .populate("patient", "name")
    .populate("doctor", "name")
    .sort({ updatedAt: -1 });
};

module.exports = { askQuestion, getAllQuestions, answerQuestion, getHealthFeed };