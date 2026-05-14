const jwt = require("jsonwebtoken");
const { readBearerToken } = require("../utils/bearerToken");
const { getJwtSecret } = require("../config/jwtSecret");

const auth = (req, res, next) => {
  const token = readBearerToken(req.get("Authorization") || req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({ message: "Server auth misconfigured" });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (!payload?.id) {
      console.error("Auth middleware error: missing payload ID");
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { id: payload.id };
  } catch (error) {
    console.error("Auth middleware caught an error:", error.message);
    console.error("Token that failed:", token);
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
};

module.exports = auth;
