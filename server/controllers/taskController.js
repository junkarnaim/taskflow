
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

// Create a task for the authenticated user.
export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    category,
    status,
    dueDate,
  } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    category,
    status,
    dueDate,
    userId: req.user._id,
  });

  res.status(201).json({ task });
});

// Get tasks with search, filters, sorting, and pagination.
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

  if (status && status !== 'All') {
    match.status = status;
  }

  if (priority && priority !== 'All') {
    match.priority = priority;
  }

  if (category && category !== 'All') {
    match.category = category;
  }

  if (typeof search === 'string' && search.trim()) {
    const escapedSearch = search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    match.title = {
      $regex: escapedSearch,
      $options: 'i',
    };
  }

  const pipeline = [
    { $match: match },
    ...withPriorityWeight,
    { $sort: sortMap[sortBy] || sortMap.createdAt },
    {
      $facet: {
        tasks: [
          { $skip: (safePage - 1) * safeLimit },
          { $limit: safeLimit },
          { $project: { priorityWeight: 0 } },
        ],
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

// Get one task belonging to the authenticated user.
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

// Update only approved fields supplied by the client.
export const updateTask = asyncHandler(async (req, res) => {
  const allowedFields = [
    'title',
    'description',
    'priority',
    'category',
    'status',
    'dueDate',
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) =>
      allowedFields.includes(key)
    )
  );

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error('No valid task fields provided for update');
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

// Complete or reopen a task.
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    { $set: { status: req.body.status } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ task });
});

// Delete a task belonging to the authenticated user.
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ message: 'Task deleted successfully' });
});
