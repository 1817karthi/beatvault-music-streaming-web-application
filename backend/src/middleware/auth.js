const jwt = require("jsonwebtoken");
const { readBearerToken } = require("../utils/bearerToken");

const auth = (req, res, next) => {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { id: payload.id };
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
