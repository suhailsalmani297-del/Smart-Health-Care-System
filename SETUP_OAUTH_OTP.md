# OTP and OAuth Setup Guide

This guide explains how to configure and run the new OTP verification and OAuth features for the Smart Healthcare System.

## Prerequisites
1. You need a Gmail account to send OTP emails.
2. You need a Google Cloud Console account to get Google OAuth credentials.
3. You need a GitHub account to get GitHub OAuth credentials.

## Step 1: Update Environment Variables

Add the following environment variables to your `backend/.env` file:

```env
# Existing variables
PORT=5001
MONGO_URI=mongodb://localhost:27017/smarthealth
JWT_SECRET=your-super-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173

# Nodemailer Configuration (For OTP)
EMAIL_USER=your_gmail_address@gmail.com
# Use an "App Password" here, NOT your regular Gmail password.
# To generate: Go to Google Account -> Security -> 2-Step Verification -> App Passwords
EMAIL_PASS=your_16_character_app_password

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Step 2: Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth client ID**.
5. Select **Web application**.
6. Under **Authorized JavaScript origins**, add `http://localhost:5173` (your React frontend URL).
7. Under **Authorized redirect URIs**, add `http://localhost:5001/api/auth/google/callback` (your backend URL).
8. Copy the generated `Client ID` and `Client Secret` to your `.env` file.

## Step 3: Setting up GitHub OAuth

1. Go to your GitHub account settings.
2. Navigate to **Developer settings** > **OAuth Apps**.
3. Click **New OAuth App**.
4. Set **Homepage URL** to `http://localhost:5173`.
5. Set **Authorization callback URL** to `http://localhost:5001/api/auth/github/callback`.
6. Copy the generated `Client ID` and generate a new `Client Secret` to your `.env` file.

## Step 4: Run the Application

1. In the `backend` directory, install the new dependencies (this was already done, but just in case):
   ```bash
   npm install nodemailer passport passport-google-oauth20 passport-github2 express-session
   ```
2. Start the backend:
   ```bash
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd ../SMART
   npm run dev
   ```

## Note on OTP Verification
The OTP is sent directly to the email entered during registration. A browser prompt will appear asking the user to enter the 6-digit code.

**If you encounter issues sending emails:** Ensure your Google account has 2-Step Verification enabled and you are using a generated "App Password". Regular passwords will be blocked by Google for security reasons.
