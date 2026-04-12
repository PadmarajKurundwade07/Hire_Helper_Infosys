const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Allow OPTIONS request for CORS if needed
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { to, subject, html, smtpUser, smtpPass, emailFrom } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
      tls: {
          rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"Hire Helper" <${emailFrom || smtpUser}>`,
      to,
      subject,
      html
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
