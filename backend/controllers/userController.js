const User = require('../models/User');
const UserDetail = require('../models/UserDetail');

// @desc    Get user profile & details
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // req.user is set by the authentication middleware
    const details = await UserDetail.findOne({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        details: details || null
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching profile details' });
  }
};

// @desc    Add or Update user details
// @route   POST /api/users/details
// @access  Private
const saveDetails = async (req, res) => {
  try {
    const { fullName, address, skills, profileDescription } = req.body;

    // Validate fields
    if (!fullName || !address || !skills || !profileDescription) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Process skills into array
    let skillsArray = [];
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    } else if (Array.isArray(skills)) {
      skillsArray = skills;
    }

    if (skillsArray.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one skill' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      // Check if user already has an image stored when editing details
      const existingDetails = await UserDetail.findOne({ userId: req.user._id });
      if (existingDetails) {
        imageUrl = existingDetails.imageUrl;
      } else {
        return res.status(400).json({ success: false, message: 'Please upload a profile image' });
      }
    }

    // Save details (create new or update existing)
    const userDetail = await UserDetail.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        fullName,
        address,
        skills: skillsArray,
        profileDescription,
        imageUrl
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'User details saved successfully',
      data: userDetail
    });
  } catch (error) {
    console.error('Save details error:', error.message);
    res.status(500).json({ success: false, message: 'Server error saving details' });
  }
};

module.exports = {
  getProfile,
  saveDetails
};
