import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for token in Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for valid admin info
    if (decoded.email !== process.env.ADMIN_EMAIL || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Invalid admin credentials.' });
    }
    console.log("Auth Header:", req.headers.authorization);
console.log("Decoded:", decoded);


    // Proceed to next middleware or route
    next();
  } catch (error) {
    console.error('Admin Auth Error:', error);
    return res.status(403).json({ success: false, message: 'Token invalid or expired. Login again.' });
  }
};

export default authAdmin;
