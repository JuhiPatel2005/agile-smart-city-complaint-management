const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("./models/Admin");
const User = require("./models/User");
const authenticateAdmin = require("./middleware/auth");
const authenticateUser = require("./middleware/userAuth");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Complaint = require("./models/Complaint");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "10kb" }));

const { buildComplaintRecord } = require("./services/complaintIntake");

const PORT = process.env.PORT || 5000;

async function generateComplaintId() {
  const year = new Date().getFullYear();

  const lastComplaint = await Complaint.findOne({
    complaintId: new RegExp(`^CIV-${year}-`)
  }).sort({ createdAt: -1 });

  let number = 10001;

  if (lastComplaint) {
    const lastNumber = parseInt(lastComplaint.complaintId.split("-")[2], 10);

    if (!isNaN(lastNumber)) {
      number = lastNumber + 1;
    }
  }

  return `CIV-${year}-${number}`;
}

app.get("/", (req, res) => {
  res.json({
    message: "Smart City Complaint Management API is running"
  });
});

app.post("/api/classify", async (req, res) => {
  try {
    const result = buildComplaintRecord(req.body || {});
    res.json({ success: true, complaint: result, result });
  } catch (error) {
    res.status(400).json({ error: error.message || "Invalid complaint details." });
  }
});

app.post("/api/complaints", authenticateUser, async (req, res) => {
  try {
    const { complaint, category, location, landmark, city, postalCode, severity, originalComplaintId } = req.body;

    if (!complaint || typeof complaint !== "string") {
      return res.status(400).json({
        error: "Complaint is required."
      });
    }

    const cleanedComplaint = complaint.trim();
    let data;
    try {
      data = buildComplaintRecord({ complaint: cleanedComplaint, category, location, landmark, city, postalCode, severity });
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    let resubmissionSource = null;

    if (
      originalComplaintId !== undefined &&
      originalComplaintId !== null &&
      String(originalComplaintId).trim() !== ""
    ) {
      const originalId = String(originalComplaintId).trim();

      const originalComplaint = await Complaint.findOne({
        complaintId: originalId
      }).lean();

      if (!originalComplaint) {
        return res.status(404).json({
          error: "The original complaint was not found."
        });
      }

      if (String(originalComplaint.userId) !== String(req.user._id)) {
        return res.status(403).json({
          error: "You are not authorized to resubmit this complaint."
        });
      }

      if (originalComplaint.status !== "Resolved") {
        return res.status(400).json({
          error:
            "Only a complaint that is awaiting your confirmation can be resubmitted."
        });
      }

      const existingResubmission = await Complaint.findOne({
        userId: req.user._id,
        originalComplaintId: originalId,
        status: { $ne: "Closed" }
      })
        .sort({ createdAt: -1 })
        .lean();

      if (existingResubmission) {
        return res.status(409).json({
          error: "This complaint has already been resubmitted.",
          complaintId: existingResubmission.complaintId
        });
      }

      resubmissionSource = originalId;
    }

    const complaintId = await generateComplaintId();

    const newComplaint = await Complaint.create({
      complaintId,
      userId: req.user._id,
      description: data.description,
      issue: data.issue,
      category: data.category,
      department: data.department,
      location: data.location,
      area: data.area,
      landmark: data.landmark,
      city: data.city,
      postalCode: data.postalCode,
      severity: data.severity,
      summary: data.summary,
      status: "Submitted",
      isResubmission: Boolean(resubmissionSource),
      originalComplaintId: resubmissionSource
    });

    res.status(201).json({
      success: true,
      complaint: newComplaint
    });
  } catch (error) {
    console.error("Complaint creation error:", error);

    res.status(500).json({
      error: "Failed to create complaint."
    });
  }
});

app.get(
  "/api/complaints/:complaintId",
  authenticateUser,
  async (req, res) => {
    try {
      const complaintId = req.params.complaintId.trim();

      if (!complaintId) {
        return res.status(400).json({
          error: "Complaint ID is required."
        });
      }

      const complaint = await Complaint.findOne({
        complaintId
      }).lean();

      if (!complaint) {
        return res.status(404).json({
          error: "Complaint not found."
        });
      }

      if (String(complaint.userId) !== String(req.user._id)) {
        return res.status(403).json({
          error: "You are not authorized to view this complaint."
        });
      }

      res.json({
        success: true,
        complaint
      });
    } catch (error) {
      console.error("Complaint tracking error:", error.message);

      res.status(500).json({
        error: "Failed to retrieve complaint."
      });
    }
  }
);

app.patch(
  "/api/complaints/:complaintId/close",
  authenticateUser,
  async (req, res) => {
    try {
      const complaintId = req.params.complaintId.trim();

      if (!complaintId) {
        return res.status(400).json({
          error: "Complaint ID is required."
        });
      }

      const complaint = await Complaint.findOne({
        complaintId
      });

      if (!complaint) {
        return res.status(404).json({
          error: "Complaint not found."
        });
      }

      if (String(complaint.userId) !== String(req.user._id)) {
        return res.status(403).json({
          error: "You are not authorized to update this complaint."
        });
      }

      if (complaint.status === "Closed") {
        return res.status(409).json({
          error: "This complaint has already been closed."
        });
      }

      if (complaint.status !== "Resolved") {
        return res.status(400).json({
          error: "Only a complaint marked as resolved can be closed."
        });
      }

      complaint.status = "Closed";

      await complaint.save();

      res.json({
        success: true,
        message: "Complaint closed successfully.",
        complaint
      });
    } catch (error) {
      console.error("Complaint closure error:", error.message);

      res.status(500).json({
        error: "Failed to close complaint."
      });
    }
  }
);

app.post("/api/user/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "Name is required."
      });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "Email is required."
      });
    }

    if (!phone || typeof phone !== "string") {
      return res.status(400).json({
        error: "Phone number is required."
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        error: "Password is required."
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (normalizedName.length < 2) {
      return res.status(400).json({
        error: "Name must contain at least 2 characters."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Please enter a valid email address."
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return res.status(400).json({
        error: "Please enter a valid 10-digit phone number."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long."
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    const existingPhone = await User.findOne({
      phone: normalizedPhone
    });

    if (existingPhone) {
      return res.status(409).json({
        error: "An account with this phone number already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("User registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "An account with these details already exists."
      });
    }

    res.status(500).json({
      error: "Failed to create account."
    });
  }
});

app.post("/api/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "Email is required."
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        error: "Password is required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: "user"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("User login error:", error.message);

    res.status(500).json({
      error: "Login failed."
    });
  }
});

app.get("/api/user/me", authenticateUser, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

app.get(
  "/api/user/complaints",
  authenticateUser,
  async (req, res) => {
    try {
      const complaints = await Complaint.find({
        userId: req.user._id
      })
        .sort({ createdAt: -1 })
        .lean();

      res.json({
        success: true,
        count: complaints.length,
        complaints
      });
    } catch (error) {
      console.error("User complaints fetch error:", error.message);

      res.status(500).json({
        error: "Failed to retrieve your complaints."
      });
    }
  }
);

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "Email is required."
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        error: "Password is required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail
    });

    if (!admin) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    res.json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    res.status(500).json({
      error: "Failed to login."
    });
  }
});

app.get("/api/admin/me", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId)
      .select("_id email createdAt")
      .lean();

    if (!admin) {
      return res.status(401).json({
        error: "Admin account not found."
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error("Admin verification error:", error.message);

    res.status(500).json({
      error: "Failed to verify admin."
    });
  }
});

app.get("/api/admin/protected", authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Protected admin route accessed successfully.",
    admin: req.admin
  });
});

app.get("/api/admin/complaints", authenticateAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .lean();

    const normalizedComplaints = complaints.map((complaint) => {
      const owner =
        complaint.userId && typeof complaint.userId === "object"
          ? complaint.userId
          : null;

      return {
        ...complaint,
        userId: owner ? owner._id : null,
        citizenName: owner ? owner.name : null
      };
    });

    res.json({
      success: true,
      count: normalizedComplaints.length,
      complaints: normalizedComplaints
    });
  } catch (error) {
    console.error("Admin complaints fetch error:", error.message);

    res.status(500).json({
      error: "Failed to retrieve complaints."
    });
  }
});

app.get(
  "/api/admin/complaints/:complaintId",
  authenticateAdmin,
  async (req, res) => {
    try {
      const complaintId = req.params.complaintId.trim();

      if (!complaintId) {
        return res.status(400).json({
          error: "Complaint ID is required."
        });
      }

      const complaint = await Complaint.findOne({ complaintId })
        .populate("userId", "name email phone")
        .lean();

      if (!complaint) {
        return res.status(404).json({
          error: "Complaint not found."
        });
      }

      const owner =
        complaint.userId && typeof complaint.userId === "object"
          ? complaint.userId
          : null;

      const citizen = owner
        ? {
            name: owner.name,
            email: owner.email,
            phone: owner.phone
          }
        : null;

      res.json({
        success: true,
        complaint: {
          ...complaint,
          userId: owner ? owner._id : null
        },
        citizen
      });
    } catch (error) {
      console.error("Admin complaint detail error:", error.message);

      res.status(500).json({
        error: "Failed to retrieve complaint."
      });
    }
  }
);

app.patch(
  "/api/admin/complaints/:complaintId",
  authenticateAdmin,
  async (req, res) => {
    try {
      const complaintId = req.params.complaintId.trim();
      const { status, department } = req.body;

      if (!complaintId) {
        return res.status(400).json({
          error: "Complaint ID is required."
        });
      }

      const allowedStatuses = [
        "Submitted",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved"
      ];

      const allowedDepartments = [
        "Water Supply & Sewerage",
        "Roads & Infrastructure",
        "Electricity & Street Lighting",
        "Solid Waste Management"
      ];

      if (status !== undefined && !allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid complaint status."
        });
      }

      if (
        department !== undefined &&
        !allowedDepartments.includes(department)
      ) {
        return res.status(400).json({
          error: "Invalid department."
        });
      }

      if (status === undefined && department === undefined) {
        return res.status(400).json({
          error: "At least one field must be provided for update."
        });
      }

      const updateData = {};

      if (status !== undefined) {
        updateData.status = status;
      }

      if (department !== undefined) {
        updateData.department = department;
      }

      const complaint = await Complaint.findOneAndUpdate(
        { complaintId },
        { $set: updateData },
        {
          new: true,
          runValidators: true
        }
      ).lean();

      if (!complaint) {
        return res.status(404).json({
          error: "Complaint not found."
        });
      }

      res.json({
        success: true,
        message: "Complaint updated successfully.",
        complaint
      });
    } catch (error) {
      console.error("Admin complaint update error:", error.message);

      res.status(500).json({
        error: "Failed to update complaint."
      });
    }
  }
);

app.get("/api/admin/analytics", authenticateAdmin, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const statusCounts = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1
          }
        }
      }
    ]);

    const severityCounts = await Complaint.aggregate([
      {
        $group: {
          _id: "$severity",
          count: {
            $sum: 1
          }
        }
      }
    ]);

    const departmentCounts = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    const monthlyCounts = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const recentComplaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const statusMap = {
      Submitted: 0,
      "Under Review": 0,
      Assigned: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0
    };

    statusCounts.forEach((item) => {
      if (item._id in statusMap) {
        statusMap[item._id] = item.count;
      }
    });

    const severityMap = {
      Low: 0,
      Medium: 0,
      High: 0
    };

    severityCounts.forEach((item) => {
      if (item._id in severityMap) {
        severityMap[item._id] = item.count;
      }
    });

    const departmentMap = {
      "Water Supply & Sewerage": 0,
      "Roads & Infrastructure": 0,
      "Electricity & Street Lighting": 0,
      "Solid Waste Management": 0
    };

    departmentCounts.forEach((item) => {
      if (item._id in departmentMap) {
        departmentMap[item._id] = item.count;
      }
    });

    const currentYear = new Date().getFullYear();

    const monthlyMap = {};

    monthlyCounts.forEach((item) => {
      const year = item._id.year;
      const month = item._id.month;

      monthlyMap[`${year}-${month}`] = item.count;
    });

    const monthlyData = Array.from(
      { length: 12 },
      (_, index) => {
        const month = index + 1;

        return {
          month,
          year: currentYear,
          count: monthlyMap[`${currentYear}-${month}`] || 0
        };
      }
    );

    const resolvedCount = statusMap.Resolved;

    const resolutionRate =
      totalComplaints > 0
        ? Number(((resolvedCount / totalComplaints) * 100).toFixed(1))
        : 0;

    res.json({
      success: true,
      overview: {
        totalComplaints,
        pendingReview:
          statusMap.Submitted + statusMap["Under Review"],
        assigned: statusMap.Assigned,
        inProgress: statusMap["In Progress"],
        resolved: resolvedCount,
        closed: statusMap.Closed,
        resolutionRate
      },
      statuses: statusMap,
      severities: severityMap,
      departments: departmentMap,
      monthly: monthlyData,
      recentComplaints
    });
  } catch (error) {
    console.error("Admin analytics error:", error.message);

    res.status(500).json({
      error: "Failed to retrieve analytics."
    });
  }
});

app.get("/api/admin/departments", authenticateAdmin, async (req, res) => {
  try {
    const departmentDefinitions = [
      {
        name: "Water Supply & Sewerage",
        description:
          "Water supply interruptions, pipeline leaks, drainage and sewerage-related issues.",
        coverage: "Water supply, drainage & sewerage"
      },
      {
        name: "Roads & Infrastructure",
        description:
          "Potholes, damaged roads, broken footpaths and public infrastructure issues.",
        coverage: "Roads & public infrastructure"
      },
      {
        name: "Electricity & Street Lighting",
        description:
          "Streetlight failures, fallen wires and public electrical infrastructure issues.",
        coverage: "Public electrical services & lighting"
      },
      {
        name: "Solid Waste Management",
        description:
          "Uncollected garbage, overflowing bins, waste accumulation and cleanliness issues.",
        coverage: "Waste collection & public cleanliness"
      }
    ];

    const results = await Complaint.aggregate([
      {
        $group: {
          _id: {
            department: "$department",
            status: "$status"
          },
          count: {
            $sum: 1
          }
        }
      }
    ]);

    const departmentMap = {};

    departmentDefinitions.forEach((department) => {
      departmentMap[department.name] = {
        ...department,
        total: 0,
        active: 0,
        resolved: 0
      };
    });

    results.forEach((item) => {
      const department = item._id.department;
      const status = item._id.status;

      if (!departmentMap[department]) {
        return;
      }

      departmentMap[department].total += item.count;

      if (status === "Resolved") {
        departmentMap[department].resolved += item.count;
      } else {
        departmentMap[department].active += item.count;
      }
    });

    const departments = departmentDefinitions.map((department) => ({
      ...departmentMap[department.name],
      status: "Operational"
    }));

    const summary = {
      departments: departments.length,
      active: departments.reduce(
        (total, department) => total + department.active,
        0
      ),
      resolved: departments.reduce(
        (total, department) => total + department.resolved,
        0
      ),
      total: departments.reduce(
        (total, department) => total + department.total,
        0
      )
    };

    res.json({
      success: true,
      summary,
      departments
    });
  } catch (error) {
    console.error("Admin departments error:", error.message);

    res.status(500).json({
      error: "Failed to retrieve department data."
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "API route not found."
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error.message);

  res.status(500).json({
    error: "Internal server error."
  });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and configure the database URI.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected successfully");
  return app.listen(PORT, () => {
    console.log(`Smart City API running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
module.exports.startServer = startServer;
