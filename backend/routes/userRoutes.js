const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

router.get('/', protect, checkRole('admin'), getAllUsers);
router.get('/:id', protect, checkRole('admin'), getUser);
router.put('/:id/role', protect, checkRole('admin'), updateUserRole);
router.delete('/:id', protect, checkRole('admin'), deleteUser);

module.exports = router;
