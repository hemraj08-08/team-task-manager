const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';

    // Project stats
    const totalProjects = isAdmin
      ? await Project.countDocuments()
      : await Project.countDocuments({ members: req.user._id });

    const activeProjects = isAdmin
      ? await Project.countDocuments({ status: 'active' })
      : await Project.countDocuments({ members: req.user._id, status: 'active' });

    // Task stats
    const taskFilter = isAdmin ? {} : { assignedTo: req.user._id };
    const totalTasks = await Task.countDocuments(taskFilter);
    const pendingTasks = await Task.countDocuments({ ...taskFilter, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ ...taskFilter, status: 'in-progress' });
    const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'completed' });
    const overdueTasks = await Task.countDocuments({ ...taskFilter, status: 'overdue' });

    // Team stats (admin only)
    const totalMembers = isAdmin ? await User.countDocuments({ role: 'member' }) : null;
    const totalAdmins = isAdmin ? await User.countDocuments({ role: 'admin' }) : null;

    // Recent tasks (last 5)
    const recentTasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title')
      .sort('-createdAt')
      .limit(5);

    // Recent projects (last 5)
    const projectFilter = isAdmin ? {} : { members: req.user._id };
    const recentProjects = await Project.find(projectFilter)
      .populate('createdBy', 'name email')
      .sort('-createdAt')
      .limit(5);

    // Task status breakdown for chart
    const taskStatusChart = [
      { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
      { name: 'In Progress', value: inProgressTasks, color: '#6366f1' },
      { name: 'Completed', value: completedTasks, color: '#22c55e' },
      { name: 'Overdue', value: overdueTasks, color: '#ef4444' },
    ];

    res.json({
      success: true,
      data: {
        stats: {
          totalProjects,
          activeProjects,
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          overdueTasks,
          totalMembers,
          totalAdmins,
        },
        taskStatusChart,
        recentTasks,
        recentProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
