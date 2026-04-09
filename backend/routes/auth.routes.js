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

// ⚡ DIAGNOSTIC: Test email configuration
router.post('/test-email', async (req, res) => {
  try {
    const testEmail = 'umoney2004@gmail.com';

    console.log('\n🧪 TESTING EMAIL CONFIGURATION...');
    console.log(`📧 Test email recipient: ${testEmail}`);
    console.log(`📝 SMTP_USER: ${process.env.SMTP_USER}`);
    console.log(`📝 SMTP_PASS length: ${process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'NOT SET'}`);

    const result = await sendEmail({
      email: testEmail,
      subject: 'HireHelper - Email Configuration Test ✅',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50;">✅ Email Configuration Working!</h2>
          <p>This is a test email from HireHelper backend.</p>
          <p><strong>If you received this email, the email system is working correctly!</strong></p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    });

    if (result) {
      console.log('✅ Test email sent successfully!');
      res.json({
        success: true,
        message: 'Test email sent successfully! Check your inbox (umoney2004@gmail.com)',
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Test email failed to send');
      res.status(500).json({
        success: false,
        message: 'Test email failed - check backend logs for details',
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('❌ ERROR in test-email endpoint:', err);
    res.status(500).json({
      success: false,
      message: 'Test failed: ' + err.message,
      error: err.message
    });
  }
});

module.exports = router;
