const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    try {
        console.log(`\n📧 Sending OTP email to: ${options.email}`);

        // Simple, proven approach - create fresh transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });

        // Send the email
        const info = await transporter.sendMail({
            from: `"Hire Helper" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log(`Message ID: ${info.messageId}\n`);
        return true;
    } catch (error) {
        console.error('\n❌ ERROR SENDING EMAIL');
        console.error('Error:', error.message);
        console.error('SMTP User:', process.env.SMTP_USER);
        console.error('SMTP Pass set:', !!process.env.SMTP_PASS);
        return false;
    }
};

module.exports = sendEmail;
