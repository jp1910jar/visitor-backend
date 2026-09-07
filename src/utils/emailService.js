const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendEmailOtp(email, code) {
  await transporter.sendMail({
    from: `"Avertech Visitor Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${code} is your Avertech verification code`,
    text: `Your verification code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your verification code is <strong style="font-size:20px">${code}</strong>.</p><p>It expires in 5 minutes.</p>`,
  });
}

module.exports = { sendEmailOtp };
