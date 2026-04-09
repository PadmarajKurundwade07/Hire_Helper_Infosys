const nodemailer = require('nodemailer');
require('dotenv').config();

// ⚡ OPTIMIZATION: Create transporter ONCE and reuse it for all emails
// This prevents creating new SMTP connections for every email (massive performance improvement)
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            // ⚡ Connection pooling for faster email delivery
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 10 // 10 emails per second max
        });
        console.log('✅ Nodemailer transporter initialized with connection pooling');
    }
    return transporter;
};

const sendEmail = async (options) => {
    try {
        // ⚡ Reuse transporter instead of creating new one each time
        const transporter = getTransporter();
                            
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

