const nodemailer = require("nodemailer");

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (options) => {
    try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📧 SENDING EMAIL VIA GMAIL SMTP`);
        console.log(`${'='.repeat(60)}`);
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
        console.log(`📧 To: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("SMTP credentials not configured in environment variables (SMTP_USER, SMTP_PASS)");
        }

        console.log(`✅ Configuration Check:`);
        console.log(`   - SMTP_HOST: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
        console.log(`   - SMTP_PORT: ${process.env.SMTP_PORT || 587}`);
        console.log(`   - SMTP_USER: ${process.env.SMTP_USER}`);
        console.log(`   - SMTP_PASS: SET`);

        // Send email using Gmail SMTP
        console.log(`🚀 Connecting to Gmail SMTP...`);
        const result = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log(`✅ EMAIL SENT SUCCESSFULLY VIA GMAIL SMTP!`);
        console.log(`📮 Message ID: ${result.messageId}`);
        console.log(`📊 Response: ${JSON.stringify(result, null, 2)}`);
        console.log(`${'='.repeat(60)}\n`);

        return true;
    } catch (error) {
        console.error(`\n${'='.repeat(60)}`);
        console.error(`❌ ERROR SENDING EMAIL VIA GMAIL SMTP`);
        console.error(`${'='.repeat(60)}`);
        console.error(`Error Type: ${error.name || 'Unknown'}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Details:`, error);

        console.error(`\n⚠️  CONFIGURATION CHECK:`);
        console.error(`  ✓ SMTP_HOST: ${process.env.SMTP_HOST || 'NOT SET (using smtp.gmail.com)'}`);
        console.error(`  ✓ SMTP_PORT: ${process.env.SMTP_PORT || 'NOT SET (using 587)'}`);
        console.error(`  ✓ SMTP_USER set: ${process.env.SMTP_USER ? 'YES (' + process.env.SMTP_USER + ')' : 'NO - MISSING!'}`);
        console.error(`  ✓ SMTP_PASS set: ${process.env.SMTP_PASS ? 'YES' : 'NO - MISSING!'}`);

        console.error(`\n💡 TROUBLESHOOTING:`);
        if (!process.env.SMTP_USER) {
            console.error(`  1. SMTP_USER not set. Set it in Render environment variables.`);
        }
        if (!process.env.SMTP_PASS) {
            console.error(`  1. SMTP_PASS not set. Set it in Render environment variables.`);
            console.error(`     Use Gmail App Password, NOT regular password!`);
        }
        if (error.message.includes('Invalid login') || error.message.includes('535')) {
            console.error(`  1. Invalid Gmail credentials. Check SMTP_USER and SMTP_PASS.`);
            console.error(`     Make sure you're using Gmail App Password, not regular password!`);
        }
        if (error.message.includes('Less secure apps')) {
            console.error(`  1. Enable "Less secure app access" in Gmail account settings.`);
        }
        console.error(`${'='.repeat(60)}\n`);

        return false;
    }
};

module.exports = sendEmail;
