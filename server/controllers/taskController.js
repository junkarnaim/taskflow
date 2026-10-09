import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const sortMap = {
  dueDate: { dueDate: 1 },
  createdAt: { createdAt: -1 },
  priority: { priorityWeight: -1, dueDate: 1 },
};

const withPriorityWeight = [
  {
    $addFields: {
      priorityWeight: {
        $switch: {
          branches: [
            { case: { $eq: ['$priority', 'High'] }, then: 3 },
            { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
            { case: { $eq: ['$priority', 'Low'] }, then: 1 },
          ],
          default: 0,
        },
      },
    },
  },
];

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user._id });
  res.status(201).json({ task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const {
    search = '',
    status,
    priority,
    category,
    sortBy = 'createdAt',
    page = 1,
    limit = 8,
  } = req.query;

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 50);
  const match = { userId: req.user._id };

  if (status && status !== 'All') match.status = status;
  if (priority && priority !== 'All') match.priority = priority;
  if (category && category !== 'All') match.category = category;
  if (search.trim()) {
    match.title = { $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  }

  const pipeline = [
    { $match: match },
    ...withPriorityWeight,
    { $sort: sortMap[sortBy] || sortMap.createdAt },
    {
      $facet: {
        tasks: [{ $skip: (safePage - 1) * safeLimit }, { $limit: safeLimit }, { $project: { priorityWeight: 0 } }],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await Task.aggregate(pipeline);
  const total = result.total[0]?.count || 0;

  res.json({
    tasks: result.tasks,
    pagination: {
      total,
      page: safePage,
      pages: Math.ceil(total / safeLimit) || 1,
      limit: safeLimit,
    },
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ message: 'Task deleted successfully' });
});
