const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
      if (!req.user) {
          return res.status(401).json({ msg: "Unauthorized. No user data found." });
      }
      
      const userRole = req.user.role; 

      if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ msg: "Access Denied. Insufficient Permissions." });
      }

      next();
  };
};

module.exports = authorizeRoles;
