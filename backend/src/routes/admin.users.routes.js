const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

const {
  getAllUsers,
  toggleUserStatus,
  deleteUser
} = require('../controllers/admin.users.controller');

// Admin-only routes
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/status', protect, isAdmin, toggleUserStatus);
router.delete('/users/:id', protect, isAdmin, deleteUser);

module.exports = router;
