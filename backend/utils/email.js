const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE ACTIVATED");
    console.log("=".repeat(70));
    console.log(`📧 To: ${options.email}`);
    console.log(`📝 Subject: ${options.subject}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);

    let emailSent = false;
    let errorMessage = "";

    // 1. Try Gmail SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.log(`\n🚀 ATTEMPTING GMAIL SMTP...`);
        console.log(`📧 User: ${process.env.SMTP_USER}`);
        try {
            const gmailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS.trim() // Trim whitespace
                }
            });

            // Verify connection
            console.log(`⏳ Verifying connection...`);
            await gmailTransporter.verify();
            console.log(`✅ Connection verified`);

            await gmailTransporter.sendMail({
                from: `Hire Helper <${process.env.SMTP_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.html
            });

            console.log(`✅ SUCCESS! EMAIL SENT VIA GMAIL SMTP`);
            console.log("=".repeat(70) + "\n");
            emailSent = true;
            return true;
        } catch (error) {
            console.error(`❌ GMAIL SMTP FAILED`);
            console.error(`   Error: ${error.message}`);
            console.error(`   Code: ${error.code}`);
            errorMessage += `Gmail SMTP: ${error.message}. `;
        }
    } else {
        console.log(`⚠️  SMTP credentials not configured`);
        console.log(`   SMTP_USER: ${process.env.SMTP_USER ? "✅ SET" : "❌ MISSING"}`);
        console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? "✅ SET" : "❌ MISSING"}`);
    }

    // 2. Fallback to Resend API
    if (!emailSent && process.env.RESEND_API_KEY) {
        console.log(`\n🔄 FALLBACK: Attempting RESEND API...`);
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);

            const fromEmail = "Hire Helper <onboarding@resend.dev>";

            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: options.email,
                subject: options.subject,
                html: options.html
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log(`✅ SUCCESS! EMAIL SENT VIA RESEND API`);
            console.log(`   ID: ${data.id}`);
            console.log("=".repeat(70) + "\n");
            emailSent = true;
            return true;
        } catch (error) {
            console.error(`❌ RESEND API FAILED`);
            console.error(`   Error: ${error.message}`);
            errorMessage += `Resend: ${error.message}. `;
        }
    } else if (!emailSent) {
        console.log(`⚠️  RESEND_API_KEY not configured`);
    }

    if (!emailSent) {
        console.error("\n❌ ALL EMAIL METHODS FAILED!");
        console.error(`   Details: ${errorMessage}`);
        console.error("=".repeat(70) + "\n");
        return false;
    }

    console.log("=".repeat(70) + "\n");
    return true;
};

module.exports = sendEmail;

