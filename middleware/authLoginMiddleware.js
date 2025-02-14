const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ msg: "Access Denied. No Token Provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "Invalid Token" });
    req.user = user; // Attach user info to the request
    next();
  });
};

module.exports = authenticateToken;
