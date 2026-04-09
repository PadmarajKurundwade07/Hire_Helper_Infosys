const nodemailer = require('nodemailer');
require('dotenv').config();

// ⚡ OPTIMIZATION: Create transporter ONCE and reuse it for all emails
let transporter = null;
let isVerified = false;

const getTransporter = () => {
    if (!transporter) {
        console.log('🔌 Creating Nodemailer transporter...');
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            // ⚡ Connection pooling settings
            pool: true,
            maxConnections: 3,
            maxMessages: 50,
            rateDelta: 1000,
            rateLimit: 5,
            // Add timeout for connection
            connectionTimeout: 5000,
            socketTimeout: 5000
        });

        // Verify connection on startup
        transporter.verify((error, success) => {
            if (error) {
                console.error('❌ SMTP Connection Failed:', error.message);
                isVerified = false;
            } else {
                console.log('✅ SMTP Connection Verified - Ready to send emails');
                isVerified = true;
            }
        });
    }
    return transporter;
};

const sendEmail = async (options) => {
    try {
        const transporter = getTransporter();

        // Add a timeout wrapper for the email sending
        const sendWithTimeout = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Email sending timeout - took longer than 10 seconds'));
            }, 10000);

            transporter.sendMail({
                from: `"Hire Helper OTP Verification" <${process.env.SMTP_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.html,
            }).then(info => {
                clearTimeout(timeout);
                resolve(info);
            }).catch(err => {
                clearTimeout(timeout);
                reject(err);
            });
        });

        const info = await sendWithTimeout;
        
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
        console.error('Full error:', error);
        return false;
    }
};

module.exports = sendEmail;

