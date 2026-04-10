const { Resend } = require("resend");
const nodemailer = require("nodemailer");

// Initialize Resend with API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Gmail SMTP as fallback
const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE ACTIVATED - RESEND");
    console.log("=".repeat(70));

    try {
        console.log(`⏰ Time: ${new Date().toISOString()}`);
        console.log(`📧 Recipient: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);

        // Check environment variables
        console.log("\n🔍 ENVIRONMENT CHECK:");
        console.log(`  ✓ RESEND_API_KEY: ${process.env.RESEND_API_KEY ? "✅ SET" : "❌ MISSING"}`);
        console.log(`  ✓ EMAIL_FROM: ${process.env.EMAIL_FROM ? "✅ SET (" + process.env.EMAIL_FROM + ")" : "❌ MISSING"}`);

        if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
            throw new Error("CRITICAL: Resend credentials missing from environment!");
        }

        // Clean up EMAIL_FROM - remove angle brackets if present
        let fromEmail = process.env.EMAIL_FROM;
        if (fromEmail.includes('<') && fromEmail.includes('>')) {
            fromEmail = fromEmail.match(/<([^>]+)>/)[1];
            console.log(`  ℹ️ Cleaned EMAIL_FROM: ${fromEmail}`);
        }

        console.log(`\n🚀 SENDING EMAIL VIA RESEND...`);

        // Send email
        const data = await resend.emails.send({
            from: fromEmail,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        if (data.error) {
            throw new Error(`Resend API Error: ${data.error.message}`);
        }

        console.log(`\n✅ SUCCESS! EMAIL SENT VIA RESEND`);
        console.log(`  📮 Response ID: ${data.data?.id}`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (error) {
        console.error(`\n❌ ERROR SENDING EMAIL VIA RESEND`);
        console.error(`  Error: ${error.message}`);

        // FALLBACK: Try Gmail SMTP
        console.log("\n🔄 FALLBACK: Attempting to send via Gmail SMTP...");
        try {
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                throw new Error("Gmail SMTP credentials not configured");
            }

            let fromEmail = process.env.SMTP_USER;

            await gmailTransporter.sendMail({
                from: fromEmail,
                to: options.email,
                subject: options.subject,
                html: options.html
            });

            console.log(`\n✅ SUCCESS! EMAIL SENT VIA GMAIL SMTP`);
            console.log("=".repeat(70) + "\n");
            return true;

        } catch (smtpError) {
            console.error(`\n❌ GMAIL SMTP ALSO FAILED`);
            console.error(`  Error: ${smtpError.message}`);
            console.error("=".repeat(70) + "\n");
            return false;
        }
    }
};

module.exports = sendEmail;
