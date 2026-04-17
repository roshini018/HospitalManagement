const express = require("express");
const router = express.Router();

const { submitFeedback, getDoctorFeedback, getAllFeedback } = require("../controllers/Feedback.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Patient submits feedback
router.post("/", protect, authorize("patient"), submitFeedback);

// Get all feedback (admin only)
router.get("/", protect, authorize("admin"), getAllFeedback);

// Anyone authenticated can view doctor feedback (doctor, admin, patient)
router.get("/doctor/:id", protect, getDoctorFeedback);

module.exports = router;