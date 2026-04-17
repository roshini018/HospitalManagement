const User = require('../models/User.model');

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, bloodGroup, age, weight, height, address } = req.body;
    
    // Ensure numeric fields are correctly handled (convert empty strings to undefined)
    const updateData = {
      name,
      phone,
      avatar,
      bloodGroup,
      age: age || undefined,
      weight: weight || undefined,
      height: height || undefined,
      address,
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, changePassword };