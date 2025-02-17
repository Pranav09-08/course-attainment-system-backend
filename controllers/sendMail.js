
const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  //console.log("EMAIL_USER:", process.env.EMAIL_USER, "EMAIL_PASS:", process.env.EMAIL_PASS);
  // Create the transporter with your Gmail credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // from your .env file
      pass: process.env.EMAIL_PASS, // from your .env file (App Password)
    },
  });

  // Configure the mail options
  const mailOptions = {
    from: process.env.EMAIL_USER, // must be your authenticated email
    replyTo: email,               // dynamically using the user's email
    to: process.env.EMAIL_USER,   // receiving email (could be same as sender)
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = sendMail;
