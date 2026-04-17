const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Notification = require('../models/Notification.model');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const setCookieAndRespond = async (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  const userObj = user.toJSON();

  // If doctor, attach profile
  if (user.role === 'doctor') {
    const profile = await Doctor.findOne({ user: user._id });
    if (profile) {
      userObj.doctorProfile = profile.toObject();
    }
  }

  res.cookie('token', token, cookieOptions);
  return res.status(statusCode).json({
    success: true,
    token,
    user: userObj
  });
};

const register = async (userData) => {
  const { name, email, password, role, phone, specialization, bloodGroup, age, weight, height, address, patientProfile } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already registered", 400);

  // Extract from patientProfile if nested (matches frontend logic)
  const finalBloodGroup = bloodGroup || patientProfile?.bloodGroup;
  const finalAge = age || patientProfile?.age || patientProfile?.dob; // dob might be used for age calc later
  const finalWeight = weight || patientProfile?.weight;
  const finalHeight = height || patientProfile?.height;
  const finalAddress = address || patientProfile?.address;

  const user = await User.create({
    name,
    email,
    password,
    role: role || "patient",
    phone,
    bloodGroup: finalBloodGroup,
    age: typeof finalAge === "number" ? finalAge : undefined,
    weight: finalWeight,
    height: finalHeight,
    address: finalAddress,
  });

  // If doctor role, create doctor profile
  if (role === 'doctor') {
    await Doctor.create({
      user: user._id,
      specialization: specialization,
    });
  }

  // Welcome notification
  await Notification.create({
    user: user._id,
    title: 'Welcome to HealthSync!',
    message: `Hello ${name}, your account has been created successfully.`,
    type: 'system'
  });

  return user;
};

// const login = async (email, password) => {
//   const user = await User.findOne({ email }).select('+password');
//   if (!user) throw new AppError('Invalid email or password', 401);
//   if (!user.isActive) throw new AppError('Account is deactivated', 403);

//   const isMatch = await user.matchPassword(password);
//   if (!isMatch) throw new AppError('Invalid email or password', 401);

//   return user;
// };

const login = async (email, password) => {
  console.log("LOGIN ATTEMPT:", email);

  const user = await User.findOne({ email }).select('+password');

  console.log("USER FOUND:", user);

  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await user.matchPassword(password);

  console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new AppError('Incorrect current password', 401);

  user.password = newPassword;
  await user.save();
  return user;
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User with this email not found', 404);

  user.password = newPassword;
  await user.save();
  return user;
};

module.exports = { register, login, generateToken, setCookieAndRespond, changePassword, resetPassword };