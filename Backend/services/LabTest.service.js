const LabTest = require("../models/LabTest.model");
const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const path = require("path");
const fs = require("fs");

// Patient requests a new lab test
const createLabTest = async (patientId, testType, testName, date) => {
  const labTest = await LabTest.create({
    patient: patientId,
    testType,
    testName: testName || testType,
    date: date || new Date().toISOString().split('T')[0],
    status: "pending",
  });
  return labTest;
};

// Patient views their own lab tests
const getMyLabTests = async (patientId) => {
  return await LabTest.find({ patient: patientId }).sort({ createdAt: -1 });
};

// Admin views all lab tests
const getAllLabTests = async () => {
  return await LabTest.find()
    .populate("patient", "name email")
    .populate("sharedWith", "name email")
    .sort({ createdAt: -1 });
};

// Admin approves a lab test
const approveLabTest = async (labTestId) => {
  const labTest = await LabTest.findById(labTestId);
  if (!labTest) throw new Error("Lab test not found");
  if (labTest.status !== "pending") throw new Error("Test is not in pending state");

  labTest.status = "approved";
  await labTest.save();

  // Notify patient
  await Notification.create({
    user: labTest.patient,
    title: "Lab Test Approved",
    message: `Your lab test "${labTest.testType}" has been approved.`,
    type: "system",
  });

  return labTest;
};

// Admin rejects a lab test
const rejectLabTest = async (labTestId, reason) => {
  const labTest = await LabTest.findById(labTestId);
  if (!labTest) throw new Error("Lab test not found");
  if (labTest.status === "completed") throw new Error("Completed tests cannot be rejected");

  labTest.status = "rejected";
  await labTest.save();

  // Notify patient
  await Notification.create({
    user: labTest.patient,
    title: "Lab Test Rejected",
    message: `Your lab test "${labTest.testType}" was rejected. Reason: ${reason || "Not specified"}`,
    type: "system",
  });

  return labTest;
};

// Admin deletes a lab test
const deleteLabTest = async (labTestId) => {
  return await LabTest.findByIdAndDelete(labTestId);
};

// Admin uploads report file
const uploadReport = async (labTestId, filename) => {
  const labTest = await LabTest.findById(labTestId);
  if (!labTest) throw new Error("Lab test not found");
  if (labTest.status !== "approved") throw new Error("Test must be approved before uploading report");

  labTest.reportFile = filename;
  labTest.status = "completed";
  await labTest.save();

  // Notify patient
  await Notification.create({
    user: labTest.patient,
    title: "Lab Report Ready",
    message: `Your lab report for "${labTest.testType}" is ready for download.`,
    type: "system",
  });

  return labTest;
};

// Patient shares report with a doctor BY EMAIL
const shareReport = async (labTestId, patientId, doctorEmail) => {
  if (!doctorEmail) throw new Error("Doctor email is required");

  // Find doctor user by email
  const doctorUser = await User.findOne({ email: doctorEmail.toLowerCase(), role: "doctor" });
  if (!doctorUser) throw new Error("Doctor with this email not found");

  const labTest = await LabTest.findById(labTestId);
  if (!labTest) throw new Error("Lab test not found");
  if (labTest.patient.toString() !== patientId.toString())
    throw new Error("Not authorized to share this report");
  if (labTest.status !== "completed") throw new Error("Report is not ready yet");

  // Push doctor ID to sharedWith array if not already present
  if (!labTest.sharedWith.includes(doctorUser._id)) {
    labTest.sharedWith.push(doctorUser._id);
  }
  await labTest.save();

  // Notify doctor
  await Notification.create({
    user: doctorUser._id,
    title: "Lab Report Shared",
    message: `A patient has shared a lab report ("${labTest.testType}") with you.`,
    type: "system",
  });

  return labTest;
};

// Doctor views reports shared with them
const getSharedReports = async (doctorId) => {
  return await LabTest.find({ sharedWith: doctorId })
    .populate("patient", "name email")
    .sort({ createdAt: -1 });
};

// Download report – returns the file path after access check
const getReportFilePath = async (labTestId, userId, userRole) => {
  const labTest = await LabTest.findById(labTestId);
  if (!labTest) throw new Error("Lab test not found");
  if (!labTest.reportFile) throw new Error("No report file available");

  const isPatientOwner = labTest.patient.toString() === userId.toString();
  const isSharedDoctor = labTest.sharedWith.some(id => id.toString() === userId.toString());

  if (!isPatientOwner && !isSharedDoctor && userRole !== 'admin') {
    throw new Error("Access denied");
  }

  // Robust path resolution based on standard uploads directory structure
  // This assumes the file is in uploads/records or just uploads based on common project structure
  // Based on requirement to fix path resolution:
  const filePath = path.resolve(__dirname, "../uploads/records", labTest.reportFile);

  if (!fs.existsSync(filePath)) {
    // Attempt fallback to parent uploads dir if records dir doesn't work (for older files)
    const fallbackPath = path.resolve(__dirname, "../uploads", labTest.reportFile);
    if (fs.existsSync(fallbackPath)) return fallbackPath;
    
    console.error("ENOENT: Lab report file missing at", filePath);
    throw new Error("Report file not found on server. Please contact support.");
  }

  return filePath;
};

module.exports = {
  createLabTest,
  getMyLabTests,
  getAllLabTests,
  approveLabTest,
  rejectLabTest,
  deleteLabTest,
  uploadReport,
  shareReport,
  getSharedReports,
  getReportFilePath,
};