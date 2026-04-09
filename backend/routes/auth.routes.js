const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const sendEmail = require('../utils/email');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password with OTP
router.post('/reset-password', authController.resetPassword);

// ⚡ DIAGNOSTIC: Test email configuration with detailed logging
router.post('/test-email', async (req, res) => {
  try {
    const testEmail = req.body.email || 'umoney2004@gmail.com';

    console.log('\n🧪 TESTING EMAIL CONFIGURATION...');
    console.log(`📧 Test email recipient: ${testEmail}`);
    console.log(`🔑 RESEND_API_KEY configured: ${!!process.env.RESEND_API_KEY}`);
    console.log(`📧 EMAIL_FROM: ${process.env.EMAIL_FROM || 'NOT SET'}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    if (!process.env.RESEND_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'RESEND_API_KEY not configured in environment variables',
        fix: 'Add RESEND_API_KEY to Render dashboard environment variables'
      });
    }

    if (!process.env.EMAIL_FROM) {
      return res.status(400).json({
        success: false,
        message: 'EMAIL_FROM not configured in environment variables',
        fix: 'Add EMAIL_FROM to Render dashboard environment variables'
      });
    }

    const result = await sendEmail({
      email: testEmail,
      subject: 'HireHelper - Email Configuration Test ✅',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50;">✅ Email Configuration Working!</h2>
          <p>This is a test email from HireHelper backend.</p>
          <p><strong>If you received this email, the email system is working correctly!</strong></p>
          <p>Sent at: ${new Date().toISOString()}</p>
          <hr>
          <p style="font-size: 12px; color: #999;">
            From: ${process.env.EMAIL_FROM}<br>
            Service: Resend<br>
            Environment: ${process.env.NODE_ENV}
          </p>
        </div>
      `
    });

    if (result) {
      console.log('✅ Test email sent successfully!');
      res.json({
        success: true,
        message: `Test email sent successfully! Check your inbox (${testEmail})`,
        details: {
          recipient: testEmail,
          sender: process.env.EMAIL_FROM,
          service: 'Resend',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.log('❌ Test email failed to send');
      res.status(500).json({
        success: false,
        message: 'Test email failed - check backend logs for Resend API errors',
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('❌ ERROR in test-email endpoint:', err);
    res.status(500).json({
      success: false,
      message: 'Test failed: ' + err.message,
      error: err.message,
      hint: 'Check if RESEND_API_KEY and EMAIL_FROM are set in Render environment'
    });
  }
});

module.exports = router;
