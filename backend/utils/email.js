const sendEmail = async (options) => {
    console.log("\n" + "=".repeat(70));
    console.log("📧 EMAIL SERVICE - ATTEMPTING DELIVERY VIA RESEND");
    console.log("=".repeat(70));
    console.log(`📧 To (original): ${options.email}`);
    
    // Clean up environment variables to remove stray quotes and spaces
    const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.replace(/['"]/g, '').trim() : '';
    const emailFrom = process.env.EMAIL_FROM ? process.env.EMAIL_FROM.replace(/['"]/g, '').trim() : smtpUser;

    // Sandbox proxy for testing other emails on free Resend account
    const proxyEmail = (options.email === 'umoney2004@gmail.com') ? emailFrom : options.email;
    console.log(`📧 To (proxy target): ${proxyEmail}`);

    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY not configured");
        }

        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        console.log(`   API Key set: ✓`);
        
        const response = await resend.emails.send({
            from: 'Hire Helper <onboarding@resend.dev>',
            to: proxyEmail,
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

    } catch (error) {
        console.error(`\n❌ RESEND EMAIL SERVICE FAILED`);
        console.error(`   Error API: ${error.message}`);
        console.error("=".repeat(70) + "\n");
        throw new Error("Failed to send email via Resend API.");
    }
};

module.exports = sendEmail;


