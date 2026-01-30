const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');

// Protected route example
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Access granted to protected route',
    user: req.user
  });
});

module.exports = router;