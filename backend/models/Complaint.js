const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    issue: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        "Water Supply & Sewerage",
        "Roads & Infrastructure",
        "Electricity & Street Lighting",
        "Solid Waste Management"
      ],
      default: undefined
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Water Supply & Sewerage",
        "Roads & Infrastructure",
        "Electricity & Street Lighting",
        "Solid Waste Management"
      ]
    },
    location: {
      type: String,
      default: null,
      trim: true
    },
    area: {
      type: String,
      default: "",
      trim: true
    },
    landmark: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      default: "",
      trim: true
    },
    postalCode: {
      type: String,
      default: "",
      trim: true
    },
    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"]
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed"
      ],
      default: "Submitted"
    },
    originalComplaintId: {
      type: String,
      default: null,
      trim: true
    },
    isResubmission: {
      type: Boolean,
      default: false
    },
    // Day 4: citizens (other than the original reporter) who chose to
    // follow this civic issue because they reported the same real-world
    // problem. This is a backward-compatible addition: existing documents
    // simply have an empty array, and $addToSet keeps it duplicate-free.
    // Only the complaint ID and public civic details are exposed to these
    // followers - never the original reporter's personal information.
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: [],
      _id: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);