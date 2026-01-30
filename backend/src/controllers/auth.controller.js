const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // 1️⃣ Basic validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name, email and password are required'
      });
    }

    // 2️⃣ Check if email already exists
    const checkQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Database error',
          error: err.message
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          status: 'error',
          message: 'Email already registered'
        });
      }

      // 3️⃣ Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4️⃣ Insert user
      const insertQuery = `
        INSERT INTO users (full_name, email, password, role, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      const userRole = role || 'customer';

      db.query(
        insertQuery,
        [full_name, email, hashedPassword, userRole, 'active'],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              status: 'error',
              message: 'Failed to register user',
              error: err.message
            });
          }

          return res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            userId: result.insertId
          });
        }
      );
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};

const jwt = require('jsonwebtoken');

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required'
    });
  }

  // 2️⃣ Find user by email
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const user = results[0];

    // 3️⃣ Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({
        status: 'error',
        message: 'Account is blocked. Contact admin.'
      });
    }

    // 4️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 6️⃣ Return response
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  });
};
