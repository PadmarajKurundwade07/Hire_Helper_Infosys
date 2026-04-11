const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE - ATTEMPTING DELIVERY");
    console.log("=".repeat(70));
    console.log(`📧 To: ${options.email}`);
    console.log(`📝 Subject: ${options.subject}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`✓ HTML length: ${options.html ? options.html.length : 0} chars`);

    // Try Resend API first
    try {
        console.log(`\n🔄 Attempting CURRENT PRIMARY: RESEND API...`);
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY not configured");
        }

        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        console.log(`   API Key set: ✓`);
        
        const response = await resend.emails.send({
            from: 'Hire Helper <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.html
        });
        
        if (response.error) {
            throw new Error(`Resend API error: ${JSON.stringify(response.error)}`);
        }

        console.log(`✅ Resend API SUCCESS!`);
        console.log(`   Email ID: ${response.data.id}`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (resendError) {
        console.error(`⚠️  Resend API failed: ${resendError.message}`);
        console.log(`\n🔧 Attempting FALLBACK: GMAIL SMTP...`);

        // Fallback to Gmail SMTP
        try {
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                throw new Error("SMTP_USER or SMTP_PASS not configured - skipping Gmail SMTP");
            }

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
                from: `Hire Helper <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
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
            console.error(`\n❌ BOTH EMAIL SERVICES FAILED`);
            console.error(`   Resend API: ${resendError.message}`);
            console.error(`   Gmail SMTP: ${gmailError.message}`);
            console.error("=".repeat(70) + "\n");

            return false;
        }
    }
};

module.exports = sendEmail;


