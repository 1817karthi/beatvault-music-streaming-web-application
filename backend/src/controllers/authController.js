const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) =>
  jwt.sign({ id: String(userId) }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return res.status(201).json({ token: signToken(user._id), user: { id: user._id, name, email } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};
