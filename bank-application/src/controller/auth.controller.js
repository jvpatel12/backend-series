const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const emailServices = require("../services/email.service");

async function register(req, res) {
  const { email, name, password } = req.body;

  const isExists = await userModel.findOne({
    email,
  });

  if (isExists) {
    return res.json({
      message: "user already exists with email",
    });
  }
  const user = await userModel.create({
    email: email,
    password: password,
    name: name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_ACCESS, {
    expiresIn: "3d",
  });
  res.cookie("token", token);

 
   res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
    message: "user create succuessfully",
  });
   await emailServices.sendRegistrationEmail(user.email,user.name)
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "email is not find write correct email",
    });
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return res.status(401).json({
      message: "password is in correct add right password",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_ACCESS, {
    expiresIn: "5d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    message: "user fetch the sucessfully",
    token,
  });
}

async function getUser(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
}

async function logout(req, res) {
  try {
    const blacklistModel = require("../model/blacklist.model");
    const jwt = require("jsonwebtoken");

    const token = req.token;
    const user = req.user;

    if (!token) {
      return res.status(400).json({
        message: "No token found to blacklist",
      });
    }

    // Decode token to get expiration
    const decoded = jwt.verify(token, process.env.TOKEN_ACCESS);

    // Add token to blacklist
    await blacklistModel.create({
      token: token,
      user: user._id,
      expiresAt: new Date(decoded.exp * 1000), // Convert from seconds to milliseconds
      reason: "LOGOUT",
    });

    // Clear cookie
    res.clearCookie("token");

    res.status(200).json({
      message: "Logged out successfully",
      logoutTime: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging out",
      error: error.message,
    });
  }
}

module.exports = { register, loginUser, getUser, logout };
