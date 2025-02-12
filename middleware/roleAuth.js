// Middleware to check if the user has the required role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Comes from authenticateToken middleware
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ msg: "Access Denied. Insufficient Permissions." });
      }
  
      next(); // User has permission, proceed to the next middleware or route handler
    };
  };
  
  module.exports = authorizeRoles;
  