const labTestService = require("../services/LabTest.service");

const createLabTest = async (req, res) => {
  try {
    const { testType, testName, date } = req.body;
    if (!testType && !testName) return res.status(400).json({ message: "Test type/name is required" });

    const labTest = await labTestService.createLabTest(req.user._id, testType || testName, testName, date);
    res.status(201).json({ success: true, message: "Lab test requested successfully", labTest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyLabTests = async (req, res) => {
  try {
    const tests = await labTestService.getMyLabTests(req.user._id);
    res.json(tests || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllLabTests = async (req, res) => {
  try {
    const tests = await labTestService.getAllLabTests();
    console.log("Lab tests fetched for admin:", tests.length);
    res.json({ success: true, tests: tests || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveLabTest = async (req, res) => {
  try {
    const labTest = await labTestService.approveLabTest(req.params.id);
    res.json({ message: "Lab test approved", labTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const rejectLabTest = async (req, res) => {
  try {
    const { reason } = req.body;
    const labTest = await labTestService.rejectLabTest(req.params.id, reason);
    res.json({ message: "Lab test rejected", labTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteLabTest = async (req, res) => {
  try {
    await labTestService.deleteLabTest(req.params.id);
    res.json({ message: "Lab test deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const labTest = await labTestService.uploadReport(req.params.id, req.file.filename);
    res.json({ message: "Report uploaded successfully", labTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const downloadReport = async (req, res) => {
  try {
    const filePath = await labTestService.getReportFilePath(
      req.params.id,
      req.user._id,
      req.user.role
    );
    res.download(filePath);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const shareReport = async (req, res) => {
  try {
    const { doctorEmail } = req.body;
    if (!doctorEmail) return res.status(400).json({ message: "doctorEmail is required" });

    const labTest = await labTestService.shareReport(req.params.id, req.user._id, doctorEmail);
    res.json({ message: "Report shared with doctor successfully", labTest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSharedReports = async (req, res) => {
  try {
    const reports = await labTestService.getSharedReports(req.user._id);
    res.json(reports || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};