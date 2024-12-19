const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

// Register user
const registerUser = async (req, res) => {
    const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;

    try {
        const userExists = await User.findOne({ NIDNumber });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            firstName,
            lastName,
            NIDNumber,
            phoneNumber,
            password,
            bloodGroup
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: process.env.COOKIE_EXPIRES_IN * 1000 });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { NIDNumber, password } = req.body;

    try {
        const user = await User.findOne({ NIDNumber });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: process.env.COOKIE_EXPIRES_IN * 1000 });
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the single user profile
const getUserProfile = (req, res) => {
    const user = req.user;
    res.status(200).json({ user });
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { firstName, lastName, phoneNumber, bloodGroup } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, phoneNumber, bloodGroup },
            { new: true }
        );
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    deleteUser
};
