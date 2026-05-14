const express = require('express');
const router = express.Router();
const {
  createProject, getProjects, getProject, updateProject, deleteProject, addMember, removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

router.route('/')
  .get(protect, getProjects)
  .post(protect, checkRole('admin'), createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, checkRole('admin'), updateProject)
  .delete(protect, checkRole('admin'), deleteProject);

router.post('/:id/members', protect, checkRole('admin'), addMember);
router.delete('/:id/members/:userId', protect, checkRole('admin'), removeMember);

module.exports = router;
