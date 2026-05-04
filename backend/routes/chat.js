const express = require('express')
const router = express.Router()
const Message = require('../models/Message')

// Get chat history between two users
router.get('/history/:userId/:otherId', async (req, res) => {
  try {
    const { userId, otherId } = req.params
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 })
    
    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get all chats for a user (list of people they've talked to)
router.get('/chats/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: -1 })

    const chatPartners = new Map()
    messages.forEach(m => {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId
      const partnerName = m.senderId === userId ? m.receiverName : m.senderName
      if (!chatPartners.has(partnerId)) {
        chatPartners.set(partnerId, {
          id: partnerId,
          name: partnerName,
          lastMsg: m.text,
          time: m.timestamp
        })
      }
    })

    res.json({ success: true, data: Array.from(chatPartners.values()) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
