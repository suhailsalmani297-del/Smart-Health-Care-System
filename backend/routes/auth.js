// filepath: backend/routes/auth.js
const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Otp = require('../models/Otp')
const sendEmail = require('../utils/email')
const passport = require('passport')
require('../config/passport')

const router = express.Router()

// JWT Secret from environment or default
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// =====================
// REGISTER endpoint
// =====================
// Modified to require OTP verification before creating account
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Generate OTP
    const otpCode = Otp.generateOtp();

    // Save to DB
    const otpDoc = new Otp({
      email: email.toLowerCase(),
      otp: otpCode,
      purpose: 'registration',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });
    await otpDoc.save();

    // Send email
    try {
      await sendEmail({
        email: email.toLowerCase(),
        subject: 'Your Verification Code',
        message: `Your verification code is ${otpCode}. It expires in 5 minutes.`
      });
      res.json({ success: true, message: 'OTP sent to your email' });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

    const validOtp = await Otp.findValidOtp(email, otp, 'registration');
    if (!validOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    validOtp.verified = true;
    await validOtp.save();

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =====================
// REGISTER endpoint
// =====================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, spec } = req.body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: name, email, password, role' 
      })
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role must be either "patient" or "doctor"' 
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      })
    }

    // Verify if OTP was completed for this email
    const verifiedOtp = await Otp.findOne({
      email: email.toLowerCase(),
      purpose: 'registration',
      verified: true
    });
    
    // We only enforce OTP in production or if the user specifically asked for it. 
    // We should enforce it now as per requirements.
    if (!verifiedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please verify OTP first.'
      });
    }

    // Optionally delete the OTP doc to prevent reuse
    await Otp.deleteOne({ _id: verifiedOtp._id });

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      spec: spec || ''
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    })

  } catch (error) {
    console.error('Register error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      })
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    })
  }
})

// =====================
// LOGIN endpoint
// =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password, and role' 
      })
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role must be either "patient" or "doctor"' 
      })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      })
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({ 
        success: false, 
        message: `Invalid credentials for ${role} login` 
      })
    }

    // Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    })
  }
})

// =====================
// VERIFY TOKEN endpoint
// =====================
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      })
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token
      }
    })

  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    })
  }
})

// =====================
// OAUTH endpoints
// =====================

router.get('/google', (req, res, next) => {
  const role = req.query.role || 'patient';
  passport.authenticate('google', { scope: ['profile', 'email'], state: role })(req, res, next);
});

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login?error=true' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&role=${req.user.role}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`);
  }
);

router.get('/github', (req, res, next) => {
  const role = req.query.role || 'patient';
  passport.authenticate('github', { scope: ['user:email'], state: role })(req, res, next);
});

router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login?error=true' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&role=${req.user.role}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`);
  }
);

module.exports = router