#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🔍 Testing Email Configuration...\n');

  console.log('SMTP Configuration:');
  console.log(`  Host: ${process.env.SMTP_HOST}`);
  console.log(`  Port: ${process.env.SMTP_PORT}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  Pass: ${process.env.SMTP_PASS ? '***SET***' : 'NOT SET'}`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('\n❌ ERROR: SMTP credentials not set in .env file');
    process.exit(1);
  }

  try {
    console.log('\n🔌 Creating transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('✅ Transporter created\n');

    console.log('🧪 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Hire Helper Test" <${process.env.SMTP_USER}>`,
      to: 'umoney2004@gmail.com',
      subject: '✅ HireHelper - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">✅ Email Configuration Working!</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Your email configuration is set up correctly.</p>
            <p style="font-size: 14px; color: #777;">This is a test email from HireHelper.</p>
            <p style="font-size: 14px; color: #777;">If you received this, OTP emails will work!</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log('\n✨ Email configuration is working correctly!\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDebug Info:');
    console.error('  Code:', error.code);
    console.error('  Response:', error.response);
    console.error('\n💡 Common Issues:');
    console.error('  1. Gmail 2FA not enabled - enable it first');
    console.error('  2. App Password not created - create one at myaccount.google.com');
    console.error('  3. Wrong app password - copy without spaces');
    console.error('  4. Account has security issues - check Gmail security settings');
    process.exit(1);
  }
}

testEmail();
