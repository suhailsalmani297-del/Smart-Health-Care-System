// filepath: backend/models/User.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema for both patients and doctors
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true
  },
  // Additional fields for doctors (optional for patients)
  spec: {
    type: String,
    default: ''
  },
  degree: {
    type: String,
    default: ''
  },
  exp: {
    type: String,
    default: ''
  },
  fee: {
    type: String,
    default: ''
  },
  hospital: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  avail: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Method to return user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model('User', userSchema)