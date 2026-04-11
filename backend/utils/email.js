const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE - ATTEMPTING DELIVERY");
    console.log("=".repeat(70));
    console.log(`📧 To: ${options.email}`);
    console.log(`📝 Subject: ${options.subject}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`✓ HTML length: ${options.html ? options.html.length : 0} chars`);

    // Try Gmail SMTP first
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("SMTP_USER or SMTP_PASS not configured - skipping Gmail SMTP");
        }

        console.log(`\n🔧 Attempting GMAIL SMTP...`);
        console.log(`   Host: smtp.gmail.com`);
        console.log(`   Port: 587`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER.trim(),
                pass: process.env.SMTP_PASS.trim()
            }
        });

        const info = await transporter.sendMail({
            from: `Hire Helper <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
            replyTo: process.env.SMTP_USER
        });

        console.log(`✅ Gmail SMTP SUCCESS!`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (gmailError) {
        console.error(`⚠️  Gmail SMTP failed: ${gmailError.message}`);
        console.log(`\n🔄 Attempting RESEND API fallback...`);

        // Fallback to Resend API
        try {
            if (!process.env.RESEND_API_KEY) {
                throw new Error("RESEND_API_KEY not configured");
            }

            console.log(`   API Key set: ✓`);
            console.log(`   Endpoint: https://api.resend.com/emails`);

            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: `Hire Helper <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
                    to: options.email,
                    subject: options.subject,
                    html: options.html
                })
            });

            console.log(`   Response Status: ${response.status} ${response.statusText}`);

            const result = await response.json();
            console.log(`   Response Body: ${JSON.stringify(result)}`);

            if (!response.ok) {
                throw new Error(`Resend API error (${response.status}): ${JSON.stringify(result)}`);
            }

            console.log(`✅ Resend API SUCCESS!`);
            console.log(`   Email ID: ${result.id}`);
            console.log("=".repeat(70) + "\n");

            return true;

        } catch (resendError) {
            console.error(`\n❌ BOTH EMAIL SERVICES FAILED`);
            console.error(`   Gmail SMTP: ${gmailError.message}`);
            console.error(`   Resend API: ${resendError.message}`);
            console.error("=".repeat(70) + "\n");

            return false;
        }
    }
};

module.exports = sendEmail;


