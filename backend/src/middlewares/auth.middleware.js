const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  // 1️⃣ Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2️⃣ If no token
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token missing'
    });
  }

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user info to request
    req.user = decoded;

    next(); // allow request to continue
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token invalid'
    });
  }
};