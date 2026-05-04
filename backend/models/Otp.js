// filepath: backend/models/Otp.js
const mongoose = require('mongoose')

// OTP Schema for email verification
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'password_reset'],
    default: 'registration'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index to auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Static method to generate OTP
otpSchema.statics.generateOtp = function() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Static method to find valid OTP
otpSchema.statics.findValidOtp = async function(email, otp, purpose) {
  return await this.findOne({
    email: email.toLowerCase(),
    otp: otp,
    purpose: purpose || 'registration',
    verified: false,
    expiresAt: { $gt: new Date() }
  })
}

module.exports = mongoose.model('Otp', otpSchema)