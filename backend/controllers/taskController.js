const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

// @desc    Create task
// @route   POST /api/tasks
// @access  Admin
const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, priority, status, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority,
      status,
      dueDate,
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('projectId', 'title');

    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, projectId, assignedTo } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Members only see their tasks
    if (req.user.role !== 'admin') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title status')
      .sort('-createdAt');

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task with comments
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title status');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const comments = await Comment.find({ taskId: task._id })
      .populate('userId', 'name email')
      .sort('createdAt');

    res.json({ success: true, data: { ...task.toObject(), comments } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Admin + Assigned Member
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Members can only update their own task status
    if (req.user.role !== 'admin') {
      const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
      if (!isAssigned) return res.status(403).json({ success: false, message: 'Access denied' });
      // Members can only update status
      const { status } = req.body;
      task.status = status || task.status;
    } else {
      // Admin can update everything
      const { title, description, assignedTo, priority, status, dueDate } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('projectId', 'title');

    res.json({ success: true, message: 'Task updated', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    await Comment.deleteMany({ taskId: task._id });
    await task.deleteOne();

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const comment = await Comment.create({
      taskId: task._id,
      userId: req.user._id,
      text: req.body.text,
    });
    await comment.populate('userId', 'name email');

    res.status(201).json({ success: true, message: 'Comment added', data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, addComment };
