import express from 'express';
import { customerAuthController } from '../controllers/auth/customerAuthController.js';

const router = express.Router();

//auth
router.get('/', (req, res) => {
  res.render('client/login');
});
router.get('/register', (req, res) => {
  res.render('client/register');
});

router.post('/login', customerAuthController.login);
router.post('/register', customerAuthController.register);

export default router;
