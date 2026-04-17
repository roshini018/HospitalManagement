const authService = require('../services/auth.service');
const Doctor = require('../models/Doctor.model');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    await authService.setCookieAndRespond(res, user, 201);
  } catch (error) {
    next(error);
  }
  console.log("BODY:", req.body);
};

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Please provide email and password' });
//     }
//     const user = await authService.login(email, password);
//     authService.setCookieAndRespond(res, user);
//   } catch (error) {
//     next(error);
//   }
  
// };
const login = async (req, res, next) => {
  console.log("LOGIN CONTROLLER HIT"); // 👈 ADD THIS

  try {
    const { email, password } = req.body;

    console.log("BODY:", email, password); // 👈 ADD

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await authService.login(email, password);

    await authService.setCookieAndRespond(res, user);
  } catch (error) {
    console.log("LOGIN ERROR:", error.message); // 👈 ADD
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = req.user.toJSON();
    if (req.user.role === 'doctor') {
      const profile = await Doctor.findOne({ user: req.user._id });
      if (profile) user.doctorProfile = profile.toObject();
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const User = require('../models/User.model');
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'If that email is registered, you will be able to reset the password.' });
    }
    res.json({ success: true, message: 'Email verified. Please set your new password.' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    await authService.resetPassword(email, newPassword);
    res.json({ success: true, message: 'Password has been reset. Please login with your new password.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe, changePassword, forgotPassword, resetPassword };