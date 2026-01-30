const db = require('../config/db');

/**
 * GET all users
 */
exports.getAllUsers = (req, res) => {
  const query = `
    SELECT id, full_name, email, role, status, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch users',
        error: err.message
      });
    }

    res.status(200).json({
      status: 'success',
      data: results
    });
  });
};

/**
 * BLOCK / UNBLOCK user
 */
exports.toggleUserStatus = (req, res) => {
  const userId = req.params.id;

  const query = `
    UPDATE users
    SET status = IF(status = 'active', 'blocked', 'active')
    WHERE id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update user status'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User status updated successfully'
    });
  });
};

/**
 * DELETE user
 */
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [userId], (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete user'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  });
};
