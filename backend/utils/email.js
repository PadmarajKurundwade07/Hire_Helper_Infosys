const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        console.log(`\n📧 Sending email via Resend to: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);

        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not configured");
        }

        if (!process.env.EMAIL_FROM) {
            throw new Error("EMAIL_FROM is not configured");
        }

        // Send email using Resend
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });

        console.log("✅ EMAIL SENT SUCCESSFULLY VIA RESEND!");
        console.log(`Message ID: ${result.id}`);
        console.log(`Response:`, result);
        console.log("");

        return true;
    } catch (error) {
        console.error("\n❌ ERROR SENDING EMAIL VIA RESEND:");
        console.error("Error Message:", error.message);
        console.error("Error:", error);

        console.error("\n⚠️  Configuration Check:");
        console.error(
            `  RESEND_API_KEY set: ${process.env.RESEND_API_KEY ? "YES" : "NO"}`
        );
        console.error(
            `  EMAIL_FROM set: ${process.env.EMAIL_FROM ? "YES (" + process.env.EMAIL_FROM + ")" : "NO"}`
        );

        return false;
    }
};

module.exports = sendEmail;
