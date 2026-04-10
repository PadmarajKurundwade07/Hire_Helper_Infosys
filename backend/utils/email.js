const nodemailer = require("nodemailer");

// Initialize Gmail SMTP (PRIMARY)
const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
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
        console.log(`  ✓ SMTP_USER: ${process.env.SMTP_USER ? "✅ SET" : "❌ MISSING"}`);
        console.log(`  ✓ SMTP_PASS: ${process.env.SMTP_PASS ? "✅ SET" : "❌ MISSING"}`);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("CRITICAL: Gmail SMTP credentials missing from environment!");
        }

        console.log(`\n🚀 SENDING EMAIL VIA GMAIL SMTP...`);

        // Send email via Gmail SMTP
        await gmailTransporter.sendMail({
            from: `Hire Helper <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        });

        console.log(`\n✅ SUCCESS! EMAIL SENT VIA GMAIL SMTP`);
        console.log(`  📧 From: ${process.env.SMTP_USER}`);
        console.log(`  📮 To: ${options.email}`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (error) {
        console.error(`\n❌ ERROR SENDING EMAIL VIA GMAIL SMTP`);
        console.error(`  Error: ${error.message}`);
        console.error(`  Type: ${error.name}`);
        console.error("=".repeat(70) + "\n");
        return false;
    }
};

module.exports = sendEmail;
