const nodemailer = require("nodemailer");

async function test() {
    const user = "pp.kurundwade@gmail.com";
    const pass = "mbhr ahbh zpff cpiv".replace(/['"]/g, "").trim();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user,
            pass: pass
        }
    });

    try {
        const info = await transporter.sendMail({
            from: user,
            to: "pp.kurundwade@gmail.com",
            subject: "Test",
            text: "test"
        });
        console.log("Success:", info.messageId);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
