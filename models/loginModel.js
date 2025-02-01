const db = require("../db/db");

// Find user by email
exports.findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM Faculty WHERE email = ?", [email]);
  return rows.length > 0 ? rows[0] : null;
};
