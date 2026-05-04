const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  senderName: String,
  receiverName: String,
  text: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Message', MessageSchema)
