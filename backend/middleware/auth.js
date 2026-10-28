const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function authenticateAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required."
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication token is missing."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.adminId || decoded.role) {
      return res.status(403).json({
        error: "Administrator access is required."
      });
    }

    const admin = await Admin.findById(decoded.adminId)
      .select("_id email")
      .lean();

    if (!admin) {
      return res.status(401).json({
        error: "Admin account not found."
      });
    }

    req.admin = {
      ...decoded,
      email: admin.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired authentication token."
    });
  }
}

module.exports = authenticateAdmin;