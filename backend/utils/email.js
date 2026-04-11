const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE - ATTEMPTING DELIVERY");
    console.log("=".repeat(70));
    console.log(`📧 To: ${options.email}`);
    console.log(`📝 Subject: ${options.subject}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);

    try {
        // Gmail SMTP Configuration
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("SMTP_USER or SMTP_PASS not configured");
        }

        console.log(`\n🔧 GMAIL SMTP Configuration:`);
        console.log(`   Host: smtp.gmail.com`);
        console.log(`   Port: 587`);
        console.log(`   User: ${process.env.SMTP_USER}`);
        console.log(`   Pass: [SET]`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false, // Use TLS, not SSL
            auth: {
                user: process.env.SMTP_USER.trim(),
                pass: process.env.SMTP_PASS.trim() // Remove any spaces
            }
        });

        console.log(`\n⏳ Verifying SMTP connection...`);

        // Verify connection before sending
        const verified = await transporter.verify();
        if (!verified) {
            throw new Error("SMTP connection verification failed");
        }
        console.log(`✅ SMTP connection verified`);

        console.log(`\n🚀 Sending email...`);
        const info = await transporter.sendMail({
            from: `Hire Helper <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
            replyTo: process.env.SMTP_USER
        });

        console.log(`✅ SUCCESS!`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Response: ${info.response}`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (error) {
        console.error(`\n❌ EMAIL SEND FAILED`);
        console.error(`   Error Name: ${error.name}`);
        console.error(`   Error Code: ${error.code}`);
        console.error(`   Error Message: ${error.message}`);
        console.error(`   Full Error: ${JSON.stringify(error, null, 2)}`);
        console.error("=".repeat(70) + "\n");

        return false;
    }
};

module.exports = sendEmail;


