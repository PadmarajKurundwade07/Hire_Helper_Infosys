const nodemailer = require('nodemailer');
require('dotenv').config();

// Simple, direct email sending - using Gmail service for reliability
const sendEmail = async (options) => {
    try {
        console.log(`\n📧 Attempting to send email to: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);

        // Create transporter - Try port 465 with SSL (more reliable on Render)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // SSL/TLS required
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            family: 4, // Force IPv4
            connectionTimeout: 10000,
            socketTimeout: 10000
        });

        // Send email
        const info = await transporter.sendMail({
            from: `"Hire Helper OTP Verification" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
        console.log(`Message ID: ${info.messageId}`);
        console.log(`Response: ${info.response}\n`);

        return true;
    } catch (error) {
        console.error('\n❌ ERROR SENDING EMAIL:');
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);

        console.error('\nCredentials Debug:');
        console.error(`  SMTP_USER set: ${process.env.SMTP_USER ? 'YES (' + process.env.SMTP_USER + ')' : 'NO'}`);
        console.error(`  SMTP_PASS set: ${process.env.SMTP_PASS ? 'YES (' + process.env.SMTP_PASS.length + ' chars)' : 'NO'}`);

        if (error.code === 'EAUTH') {
            console.error('\n⚠️  Authentication failed! Check Gmail App Password.');
            console.error('Make sure password has NO SPACES and is correct.');
        }

        console.error('\nFull error:', error.stack);

        return false;
    }
};

module.exports = sendEmail;
