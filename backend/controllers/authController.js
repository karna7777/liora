import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
