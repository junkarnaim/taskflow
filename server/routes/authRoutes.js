import express from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must include an uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must include a lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must include a number'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.get('/me', protect, me);

export default router;
