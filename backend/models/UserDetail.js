const mongoose = require('mongoose');

const UserDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add full name'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add address'],
    trim: true
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  profileDescription: {
    type: String,
    required: [true, 'Please add a profile description'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Please upload a profile image']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserDetail', UserDetailSchema);
