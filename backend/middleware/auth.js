const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — requires valid JWT
exports.protect = async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authenticated. No token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Admin-only guard (must come after protect)
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};
