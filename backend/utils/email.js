const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    try {
        console.log(`\n📧 Sending email via SendGrid to: ${options.email}`);

        // Check if API key is set
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error('SENDGRID_API_KEY not set in environment variables');
        }

        const msg = {
            to: options.email,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@hirehelper.com',
            subject: options.subject,
            html: options.html,
        };

        const response = await sgMail.send(msg);

        console.log('✅ EMAIL SENT SUCCESSFULLY VIA SENDGRID!');
        console.log(`Response: ${response[0].statusCode}\n`);
        return true;
    } catch (error) {
        console.error('\n❌ ERROR SENDING EMAIL VIA SENDGRID:');
        console.error('Error:', error.message);

        if (error.message.includes('SENDGRID_API_KEY')) {
            console.error('\n⚠️  SENDGRID_API_KEY not configured!');
            console.error('Set it in Render environment variables');
        }

        return false;
    }
};

module.exports = sendEmail;
