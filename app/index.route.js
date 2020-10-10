import express from 'express';
import userRoutes from './user/user.route';
import authRoutes from './auth/auth.route';
import publishingRoutes from './publishing/publishing.route';
import isAuth from './middleware/is-auth';
import { APIsuccess } from './helpers/API-responses';

const router = express.Router(); // eslint-disable-line new-cap

// Testing routes /api/test && /api/test-auth
router.get('/test', (req, res) =>
  res.status(200).json(APIsuccess(200, { message: 'Hey it works!' }))
);
router.get('/test-auth', isAuth(), (req, res) => res.status(200).json(APIsuccess(200, req.user)));

// Auth routes /api/auth
router.use('/auth', authRoutes);

// Users routes /api/users
router.use('/users', userRoutes);

// Publishing routes /publishings
router.use('/publishings', publishingRoutes);

export default router;
