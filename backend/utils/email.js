const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📧 SENDING EMAIL VIA RESEND`);
        console.log(`${'='.repeat(60)}`);
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
        console.log(`📧 To: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);

        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not configured in environment variables");
        }

        if (!process.env.EMAIL_FROM) {
            throw new Error("EMAIL_FROM is not configured in environment variables");
        }

        console.log(`✅ Configuration Check:`);
        console.log(`   - RESEND_API_KEY: SET (length: ${process.env.RESEND_API_KEY.length})`);
        console.log(`   - EMAIL_FROM: ${process.env.EMAIL_FROM}`);

        // Send email using Resend
        console.log(`🚀 Calling Resend API...`);
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log(`✅ EMAIL SENT SUCCESSFULLY VIA RESEND!`);
        console.log(`📮 Message ID: ${result.id}`);
        console.log(`📊 Response Status: ${result.from ? 'Queued' : 'Failed'}`);
        console.log(`📋 Full Response:`, JSON.stringify(result, null, 2));
        console.log(`${'='.repeat(60)}\n`);

        return true;
    } catch (error) {
        console.error(`\n${'='.repeat(60)}`);
        console.error(`❌ ERROR SENDING EMAIL VIA RESEND`);
        console.error(`${'='.repeat(60)}`);
        console.error(`Error Type: ${error.name || 'Unknown'}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Details:`, error);

        console.error(`\n⚠️  CONFIGURATION CHECK:`);
        console.error(`  ✓ RESEND_API_KEY set: ${process.env.RESEND_API_KEY ? 'YES (length: ' + process.env.RESEND_API_KEY.length + ')' : 'NO - MISSING!'}`);
        console.error(`  ✓ EMAIL_FROM set: ${process.env.EMAIL_FROM ? 'YES (' + process.env.EMAIL_FROM + ')' : 'NO - MISSING!'}`);
        console.error(`  ✓ EMAIL_FROM is email: ${process.env.EMAIL_FROM && process.env.EMAIL_FROM.includes('@') ? 'YES' : 'NO'}`);

        console.error(`\n💡 TROUBLESHOOTING:`);
        if (!process.env.RESEND_API_KEY) {
            console.error(`  1. RESEND_API_KEY not set. Set it in Render environment variables.`);
        }
        if (!process.env.EMAIL_FROM) {
            console.error(`  1. EMAIL_FROM not set. Set it in Render environment variables.`);
        }
        if (error.message.includes('Unauthorized')) {
            console.error(`  1. API key is invalid or expired. Check Resend dashboard.`);
        }
        if (error.message.includes('invalid_request_url')) {
            console.error(`  1. Invalid email address. Check the 'to' email format.`);
        }
        console.error(`${'='.repeat(60)}\n`);

        return false;
    }
};

module.exports = sendEmail;
