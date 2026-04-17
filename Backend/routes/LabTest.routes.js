const express = require("express");
const router = express.Router();

const {
  createLabTest,
  getMyLabTests,
  getAllLabTests,
  approveLabTest,
  rejectLabTest,
  deleteLabTest,
  uploadReport,
  downloadReport,
  shareReport,
  getSharedReports,
} = require("../controllers/LabTest.controller");

const { protect, authorize } = require("../middleware/auth.middleware"); // your existing auth middleware
const upload = require("../middleware/upload.middleware");

// Patient routes
router.post("/", protect, authorize("patient"), createLabTest);
router.get("/my", protect, authorize("patient"), getMyLabTests);
router.post("/:id/share", protect, authorize("patient"), shareReport);

// Doctor routes
router.get("/shared", protect, authorize("doctor"), getSharedReports);

// Admin routes
router.get("/", protect, authorize("admin"), getAllLabTests);
router.put("/:id/approve", protect, authorize("admin"), approveLabTest);
router.put("/:id/reject", protect, authorize("admin"), rejectLabTest);
router.delete("/:id", protect, authorize("admin"), deleteLabTest);
router.put("/:id/report", protect, authorize("admin"), upload.single("reportFile"), uploadReport);

// Shared: Patient (owner) or Doctor (if shared)
router.get("/:id/download", protect, downloadReport);

module.exports = router;