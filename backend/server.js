// filepath: backend/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const session = require('express-session')
const passport = require('passport')

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require('./routes/auth')
const chatRoutes = require('./routes/chat')
const chatbotRoutes = require('./routes/chatbot')

// Create Express app
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
const PORT = process.env.PORT || 5001

const Message = require('./models/Message')

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, text, senderRole, senderName, receiverName } = data
    
    const newMsg = new Message({
      senderId,
      receiverId,
      text,
      senderRole,
      senderName,
      receiverName
    })

    await newMsg.save()

    // Send to receiver
    io.to(receiverId).emit('receiveMessage', newMsg)
    // Also send back to sender for confirmation/sync
    io.to(senderId).emit('receiveMessage', newMsg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// =====================
// MIDDLEWARE
// =====================

// CORS - allow frontend to communicate
app.use(cors())

// Logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
})

// Body parser - parse JSON requests
app.use(express.json())

// Session middleware (required for passport OAuth)
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}))

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// =====================
// ROUTES
// =====================

// Auth routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/chatbot', chatbotRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Smart Healthcare API is running',
    timestamp: new Date().toISOString()
  })
})

// =====================
// DATABASE CONNECTION
// =====================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI
    
    if (!mongoURI) {
      console.warn('⚠️  MONGO_URI not found in .env file')
      console.warn('⚠️  Please create a .env file with MONGO_URI=mongodb://localhost:27017/smarthealth')
      console.warn('⚠️  Running in demo mode (no database connection)')
      return
    }

    await mongoose.connect(mongoURI)
    console.log('✅ MongoDB connected successfully')
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    console.warn('⚠️  Running without database connection')
  }
}

// =====================
// START SERVER
// =====================
const startServer = async () => {
  // Connect to database
  await connectDB()

  // Start listening on port
  http.listen(PORT, '0.0.0.0', () => {

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥 Smart Healthcare System - Backend API               ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   API endpoints:                                          ║
║   • POST /api/auth/register - Register new user          ║
║   • POST /api/auth/login    - Login user                 ║
║   • GET  /api/auth/verify   - Verify JWT token           ║
║   • GET  /api/health       - Health check               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `)
  })
}

// Start the server
const server = startServer();

// Handle server errors (like port already in use)
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`💡 Try to stop any other running instances or change the PORT in your .env file.`);
    process.exit(1);
  } else {
    console.error('❌ Uncaught Exception:', err);
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down server...');
  mongoose.connection.close(false).then(() => {
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app

