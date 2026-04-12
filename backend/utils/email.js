const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE - ATTEMPTING DELIVERY");
    console.log("=".repeat(70));
    console.log(`📧 To: ${options.email}`);
    console.log(`📝 Subject: ${options.subject}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`✓ HTML length: ${options.html ? options.html.length : 0} chars`);

    // Clean up environment variables to remove stray quotes and spaces
    const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.replace(/['"]/g, '').trim() : '';
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/['"]/g, '').trim() : '';
    const emailFrom = process.env.EMAIL_FROM ? process.env.EMAIL_FROM.replace(/['"]/g, '').trim() : smtpUser;

    // Try Gmail SMTP first because it is highly reliable for free-tier users
    console.log(`\n🔄 Attempting PRIMARY: GMAIL SMTP...`);
    try {
        if (!smtpUser || !smtpPass) {
            throw new Error("SMTP_USER or SMTP_PASS not configured");
        }

        console.log(`   Host: smtp.gmail.com`);
        console.log(`   Port: 465`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });

        const info = await transporter.sendMail({
            from: `"Hire Helper" <${emailFrom}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
            replyTo: smtpUser
        });

        console.log(`✅ Gmail SMTP SUCCESS!`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log("=".repeat(70) + "\n");

        return true;

    } catch (gmailError) {
        console.error(`⚠️  Gmail SMTP failed: ${gmailError.message}`);
        console.log(`\n🔧 Attempting FALLBACK: RESEND API...`);

        // Fallback to Resend API
        try {
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
            console.error(`\n❌ BOTH EMAIL SERVICES FAILED`);
            console.error(`   Gmail SMTP: ${gmailError.message}`);
            console.error(`   Resend API: ${resendError.message}`);
            console.error("=".repeat(70) + "\n");

            throw new Error("Both email services failed to send the email.");
        }
    }
};

module.exports = sendEmail;


