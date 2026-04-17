const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testType: {
      type: String,
      required: true,
      trim: true,
    },
    testName: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
    },
    reportFile: {
      type: String,
      default: null,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabTest", labTestSchema);