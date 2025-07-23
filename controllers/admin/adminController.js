const Admin = require('../../models/admin/adminModel');
const bcrypt = require("bcryptjs");
const db = require('../../db/db');
const nodemailer = require('nodemailer');

// Configure email transporter with better options
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Additional settings for better reliability
  pool: true,
  maxConnections: 1,
  rateDelta: 20000, // 20 seconds delay between messages
  rateLimit: 5, // max 5 messages per rateDelta
});

const generateFacultyId = async () => {
  const [rows] = await db.query(`
    SELECT faculty_id FROM Faculty 
    WHERE faculty_id LIKE 'emp%' 
    ORDER BY CAST(SUBSTRING(faculty_id, 4) AS UNSIGNED) DESC 
    LIMIT 1
  `);

  if (rows.length === 0) return 'emp1';

  const lastIdNum = parseInt(rows[0].faculty_id.replace('emp', ''), 10);
  return `emp${lastIdNum + 1}`;
};

const sendCredentialsEmail = async (email, facultyId, password, name) => {
  console.log("Preparing to send faculty credentials email to:", email);
  
  const resetLink = `https://teacher-attainment-system-frontend.vercel.app/forgot-password`;
  
  const mailOptions = {
    from: `"PICT Admin" <${process.env.EMAIL_USER}>`, // Consistent sender
    to: email,
    subject: 'Your Faculty Account Credentials',
    replyTo: process.env.ADMIN_REPLY_EMAIL || process.env.EMAIL_USER, // For replies
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to PICT Faculty Portal, ${name}!</h2>
        <p>Your faculty account has been created successfully.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #3498db;">
          <h3 style="margin-top: 0;">Your Login Credentials</h3>
          <p><strong>Faculty ID:</strong> ${facultyId}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p>For security reasons, please reset your password after first login:</p>
        <a href="${resetLink}" style="display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
          Reset Your Password
        </a>
        
        <p style="margin-top: 20px; font-size: 0.9em; color: #7f8c8d;">
          If you didn't request this account, please contact the admin immediately at 
          <a href="mailto:${process.env.ADMIN_REPLY_EMAIL || process.env.EMAIL_USER}">
            ${process.env.ADMIN_REPLY_EMAIL || process.env.EMAIL_USER}
          </a>
        </p>
        
        <p style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
          Best regards,<br>
          <strong>PICT Admin Team</strong>
        </p>
      </div>
    `,
    // Text fallback for non-HTML email clients
    text: `Welcome to PICT Faculty Portal!\n\nYour credentials:\nFaculty ID: ${facultyId}\nPassword: ${password}\n\nPlease reset your password after first login: ${resetLink}\n\nIf you didn't request this account, please contact the admin immediately.`
  };

  try {
    console.log("Attempting to send email to:", email);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    
    // Log email delivery (you could store this in a database)
    console.log(`Credentials email sent to ${name} <${email}> at ${new Date()}`);
    
    return true;
  } catch (error) {
    console.error("Failed to send email to", email, "Error:", error);
    
    // Special handling for common errors
    if (error.code === 'EAUTH') {
      console.error("Authentication error - check email credentials");
    } else if (error.code === 'EENVELOPE') {
      console.error("Invalid recipient address:", email);
    }
    
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

const addFaculty = async (req, res) => {
  console.log("Received request to add faculty:", req.body);
  
  if (req.user.role !== "admin") {
    console.warn("Unauthorized access attempt by user:", req.user.id);
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }

  const { name, email, mobile_no, dept_id, password, confirmPassword } = req.body;

  // Validate passwords match
  if (password !== confirmPassword) {
    console.warn("Password mismatch for:", email);
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Validate required fields
  if (!name || !email || !mobile_no || !dept_id || !password) {
    console.warn("Missing required fields for:", email);
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log("Generating faculty ID for:", email);
    const faculty_id = await generateFacultyId();
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating faculty record for:", email);
    const result = await Admin.createFaculty(faculty_id, name, email, mobile_no, dept_id, hashedPassword);

    console.log("Attempting to send credentials email to:", email);
    await sendCredentialsEmail(email, faculty_id, password, name);

    console.log("Faculty created successfully:", faculty_id);
    return res.status(201).json({ 
      message: 'Faculty added successfully. Credentials sent to email.',
      faculty_id 
    });

  } catch (err) {
    console.error("Error in addFaculty:", err);
    
    // Special handling for duplicate email
    if (err.message.includes('Duplicate') || err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists in system' });
    }
    
    // Handle email sending failures gracefully
    if (err.message.includes('Email delivery failed')) {
      return res.status(201).json({ 
        message: 'Faculty added but email delivery failed. Please notify them manually.',
        faculty_id: faculty_id || 'unknown',
        warning: err.message
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update faculty details
const updateFaculty = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }
    const { faculty_id } = req.params;
    const { name, email, mobile_no, dept_id } = req.body;
  
    console.log(`📤 Request to update faculty: ${faculty_id}`);
  
    if (!name || !email || !mobile_no || !dept_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const result = await Admin.updateFaculty(faculty_id, name, email, mobile_no, dept_id);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
  
      console.log(`✅ Faculty ${faculty_id} updated successfully`);
      res.status(200).json({ message: 'Faculty updated successfully' });
  
    } catch (err) {
      console.error('❌ Error updating faculty:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Delete faculty details
const deleteFaculty = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Only admin can access this." });
  }
    const { faculty_id } = req.params;
  
    console.log(`🗑️ Request to delete faculty: ${faculty_id}`);
  
    try {
      const result = await Admin.deleteFaculty(faculty_id);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
  
      console.log(`✅ Faculty ${faculty_id} deleted successfully`);
      res.status(200).json({ message: 'Faculty deleted successfully' });
  
    } catch (err) {
      console.error('❌ Error deleting faculty:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Get coordinators for the admin's department
const getCoordinatorsByDepartment = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Only admin can access this." });
      }
  
      const dept_id = req.user.id; // Admin's department ID
  
      console.log(`📤 Fetching coordinators for department: ${dept_id}`);
  
      const coordinators = await Admin.getCoordinatorsByDepartment(dept_id);
  
      res.status(200).json({ coordinators });
    } catch (err) {
      console.error("❌ Error fetching coordinators:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { addFaculty, updateFaculty, deleteFaculty, getCoordinatorsByDepartment};
