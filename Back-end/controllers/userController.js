import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Create new user (registration)
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
        status: 400,
        data: null,
      });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: "registered", // Default role for registered users
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      status: 201,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      status: 500,
      data: null,
    });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        status: 401,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      status: 200,
      data: { userId: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log in",
      status: 500,
      data: null,
    });
  }
};

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      status: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      status: 500,
      data: null,
    });
  }
};

// Update user details (for admin or the user themselves)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      status: 200,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      status: 500,
      data: null,
    });
  }
};

// Delete user (for admin or the user themselves)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      status: 200,
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      status: 500,
      data: null,
    });
  }
};

export { registerUser, loginUser, getAllUsers, updateUser, deleteUser };
