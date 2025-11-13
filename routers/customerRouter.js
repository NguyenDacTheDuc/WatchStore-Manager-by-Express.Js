import express from 'express';
import { customerAuthController } from '../controllers/auth/customerAuthController.js';
import { checkSession } from '../middlewares/checkSessionCustomer.js';
import { productController } from '../controllers/interactCustomer/productController.js';
import { profileController } from '../controllers/interactCustomer/profileController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('client/login');
});
router.get('/register', (req, res) => {
  res.render('client/register');
});
router.get('/forget-password', (req, res) => {
  res.render('client/forgetPassword');
});

router.post('/login', customerAuthController.login);
router.post('/logout', customerAuthController.logout);
router.post('/register', customerAuthController.register);
router.post('/forget', customerAuthController.forgetPassword);

router.get('/home', checkSession, productController.home);
router.get('/:id/change-password', checkSession, profileController.changePassword);
router.get('/:id/profile', checkSession, profileController.profile);
router.post('/:id/change-password', checkSession, profileController.change);
router.post('/:id/profile', checkSession, profileController.updateProfile);

export default router;
