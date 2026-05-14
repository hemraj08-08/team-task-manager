const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask, addComment } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

router.route('/')
  .get(protect, getTasks)
  .post(protect, checkRole('admin'), createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, checkRole('admin'), deleteTask);

router.post('/:id/comments', protect, addComment);

module.exports = router;
