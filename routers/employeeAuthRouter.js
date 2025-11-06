import express from 'express';
import employeeAuthController from '../controllers/auth/employeeAuthController.js';
import { checkSession } from '../middlewares/checkSessionAdmin.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('admin/login');
});

router.post('/login', employeeAuthController.login);
router.post('/logout', employeeAuthController.logout);

router.get('/forget-password', (req, res) => {
  res.render('admin/forgetPassword');
});
router.post('/forget-password', employeeAuthController.resetPassword);

router.get('/home', checkSession, (req, res) => {
  res.render('admin/home');
});

router.get('/:id/change-password', checkSession, (req, res) => {
  res.render('admin/changePassword');
});
router.post(
  '/:id/change-password',
  checkSession,
  employeeAuthController.changePassword
);

export default router;
