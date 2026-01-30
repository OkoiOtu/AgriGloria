const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const { getAdminStats } = require('../controllers/admin.controller');

router.get('/stats', protect, isAdmin, getAdminStats);

module.exports = router;
