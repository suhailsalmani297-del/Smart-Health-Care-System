const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_google_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_google_client_secret',
    callbackURL: 'http://localhost:5001/api/auth/google/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails[0].value;
      if (!email) return done(new Error("No email found from Google"), null);

      // Get role from state or query
      const role = req.query.state || 'patient';

      // Check if user exists
      let user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        user = new User({
          name: profile.displayName || 'Google User',
          email: email.toLowerCase(),
          password: 'oauth_dummy_password',
          role: role // Use the role passed from frontend
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'placeholder_github_client_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder_github_client_secret',
    callbackURL: '/api/auth/github/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails[0].value;
      if (!email) {
        return done(new Error("No public email found in GitHub. Please make your email public in GitHub settings."), null);
      }

      const role = req.query.state || 'patient';

      // Check if user exists
      let user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        user = new User({
          name: profile.displayName || profile.username || 'GitHub User',
          email: email.toLowerCase(),
          password: 'oauth_dummy_password',
          role: role
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
