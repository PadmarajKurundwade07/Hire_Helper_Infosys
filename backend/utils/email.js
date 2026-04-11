const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE ACTIVATED");
    console.log("=".repeat(70));

    let emailSent = false;
    let errorMessage = "";

    // 1. Try Gmail SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.log(`🚀 Attempting via GMAIL SMTP...`);
        try {
            const gmailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            await gmailTransporter.sendMail({
                from: `Hire Helper <${process.env.SMTP_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.html
            });

            console.log(`✅ SUCCESS! EMAIL SENT VIA GMAIL SMTP`);
            emailSent = true;
        } catch (error) {
            console.error(`❌ GMAIL SMTP FAILED: ${error.message}`);
            errorMessage += `Gmail Error: ${error.message}. `;
        }
    }

    // 2. Fallback to Resend API
    if (!emailSent && process.env.RESEND_API_KEY) {
        console.log(`🚀 Attempting fallback via RESEND API...`);
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            // Resend requires a verified domain. Unless verified, you must use onboarding@resend.dev
            // and you can only send to the email address registered with Resend.
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

            console.log(`✅ SUCCESS! EMAIL SENT VIA RESEND API (${data.id})`);
            emailSent = true;
        } catch (error) {
            console.error(`❌ RESEND API FAILED: ${error.message}`);
            errorMessage += `Resend Error: ${error.message}. `;
        }
    }

    if (!emailSent) {
        console.error("\n❌ ALL EMAIL SENDING METHODS FAILED!");
        console.error("=".repeat(70) + "\n");
        return false;
    }

    console.log("=".repeat(70) + "\n");
    return true;
};

module.exports = sendEmail;
