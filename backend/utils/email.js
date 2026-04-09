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
    logger: true,
    debug: true
});

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE ACTIVATED - GMAIL SMTP");
    console.log("=".repeat(70));

    try {
        console.log(`⏰ Time: ${new Date().toISOString()}`);
        console.log(`📧 Recipient: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);

        // Check environment variables
        console.log("\n🔍 ENVIRONMENT CHECK:");
        console.log(`  ✓ SMTP_HOST: ${process.env.SMTP_HOST ? "✅ SET" : "❌ MISSING"}`);
        console.log(`  ✓ SMTP_PORT: ${process.env.SMTP_PORT ? "✅ SET" : "❌ MISSING"}`);
        console.log(`  ✓ SMTP_USER: ${process.env.SMTP_USER ? "✅ SET (" + process.env.SMTP_USER + ")" : "❌ MISSING"}`);
        console.log(`  ✓ SMTP_PASS: ${process.env.SMTP_PASS ? "✅ SET (length: " + process.env.SMTP_PASS.length + ")" : "❌ MISSING"}`);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("CRITICAL: SMTP credentials missing from environment!");
        }

        console.log(`\n🚀 CONNECTING TO GMAIL SMTP...`);
        console.log(`  Host: ${process.env.SMTP_HOST || "smtp.gmail.com"}`);
        console.log(`  Port: ${process.env.SMTP_PORT || 587}`);
        console.log(`  User: ${process.env.SMTP_USER}`);

        // Send email
        const result = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log(`\n✅ SUCCESS! EMAIL SENT VIA GMAIL SMTP`);
        console.log(`  📮 Message ID: ${result.messageId}`);
        console.log(`  👤 From: ${result.envelope.from}`);
        console.log(`  👥 To: ${result.envelope.to.join(", ")}`);
        console.log(`  ⏱️  Time: ${result.messageTime}ms`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (error) {
        console.error(`\n❌ ERROR SENDING EMAIL`);
        console.error(`  Error: ${error.message}`);
        console.error(`  Type: ${error.name}`);
        console.error(`  Stack: ${error.stack}`);
        console.error("=".repeat(70) + "\n");
        return false;
    }
};

module.exports = sendEmail;
