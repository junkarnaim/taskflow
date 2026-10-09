import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();
const priorities = ['Low', 'Medium', 'High'];
const categories = ['Work', 'Study', 'Personal', 'Other'];
const statuses = ['Pending', 'Completed'];

const taskValidation = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Title must be 2-120 characters'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }).withMessage('Description is too long'),
  body('priority').isIn(priorities).withMessage('Priority must be Low, Medium, or High'),
  body('category').isIn(categories).withMessage('Category must be Work, Study, Personal, or Other'),
  body('status').optional().isIn(statuses).withMessage('Status must be Pending or Completed'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid task id')];

router.use(protect);

router
  .route('/')
  .get(
    [
      query('status').optional().isIn(['All', ...statuses]),
      query('priority').optional().isIn(['All', ...priorities]),
      query('category').optional().isIn(['All', ...categories]),
      query('sortBy').optional().isIn(['dueDate', 'createdAt', 'priority']),
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 50 }),
    ],
    validateRequest,
    getTasks
  )
  .post(taskValidation, validateRequest, createTask);

router
  .route('/:id')
  .get(idValidation, validateRequest, getTask)
  .put([...idValidation, ...taskValidation], validateRequest, updateTask)
  .delete(idValidation, validateRequest, deleteTask);

router.patch(
  '/:id/status',
  [...idValidation, body('status').isIn(statuses).withMessage('Status must be Pending or Completed')],
  validateRequest,
  updateTaskStatus
);

export default router;
