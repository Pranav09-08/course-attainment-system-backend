const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  console.log("POST /contact route hit"); // Log to confirm the route is hit
  console.log("Request headers:", req.headers); // Log request headers
  console.log("Received request body:", req.body); // Log the request body

  // Validate request body
  if (!req.body) {
    return res.status(400).json({ error: "No request body received." });
  }

  const { name, email, phone, address, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  // Validate recipient email
  if (!process.env.MAIL) {
    return res.status(500).json({ error: "Recipient email not configured." });
  }

  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    let mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MAIL, // Send to your own email or team
      subject: "New Contact Form Submission",
      replyTo: email, // Allow reply-to functionality
      html: `
        <h3>Contact Form Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Address:</strong> ${address || "N/A"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message. Try again later." });
  }
};

module.exports = sendMail;