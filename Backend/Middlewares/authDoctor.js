import jwt from 'jsonwebtoken';

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    // Attach doctor ID to request body (not recommended; use req.doctor ideally)
req.doctor = token_decode;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
