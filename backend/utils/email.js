const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    try {
        // We ensure we ONLY use the real Gmail SMTP configuration provided.
        // It strictly requires a valid SMTP_USER and an SMTP_PASS 
        // generated from Google Account App Passwords.
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
                            
        const info = await transporter.sendMail({
            from: `"Hire Helper OTP Verification" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        
        console.log('\n----------------------------------------------------');
        console.log('✅ OTP EMAIL SUCCESSFULLY DISPATCHED TO THE REAL MAILBOX!');
        console.log(`✉️  Sent to: ${options.email}`);
        console.log(`🆔 Message ID: ${info.messageId}`);
        console.log('----------------------------------------------------\n');
        
        return true;
    } catch (error) {
        console.error('\n❌ CRITICAL: Error sending OTP email directly to Gmail.');
        console.error('Error Details:', error.message);
        console.error('Error Code:', error.code);
        console.error('SMTP Config:');
        console.error('  - Host:', process.env.SMTP_HOST);
        console.error('  - Port:', process.env.SMTP_PORT);
        console.error('  - User:', process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-10) : 'NOT SET');
        console.error('  - Pass:', process.env.SMTP_PASS ? '***' : 'NOT SET');
        console.error('👉 Make sure your Google App Password is set correctly in .env file');
        console.error('👉 Gmail App Password should be 16 characters without spaces when copied');
        return false;
    }
};

module.exports = sendEmail;

