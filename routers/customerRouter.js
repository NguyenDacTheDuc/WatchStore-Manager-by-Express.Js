import express from 'express';
import { customerAuthController } from '../controllers/auth/customerAuthController.js';
import { checkSession } from '../middlewares/checkSessionCustomer.js';
import { productController } from '../controllers/interactCustomer/productController.js';
import { profileController } from '../controllers/interactCustomer/profileController.js';
import { cartController } from '../controllers/interactCustomer/cartController.js';

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
router.get('/home/product/:id', checkSession, productController.productDetail);
router.get('/:id/change-password', checkSession, profileController.changePassword);
router.get('/:id/profile', checkSession, profileController.profile);
router.post('/:id/change-password', checkSession, profileController.change);
router.post('/:id/profile', checkSession, profileController.updateProfile);

router.get('/brand/:id', checkSession, productController.getProductsByBrand);
router.get('/category/:id', checkSession, productController.getProductsByCategory);
router.get('/material/:id', checkSession, productController.getProductsByMaterial);
router.get('/origin/:id', checkSession, productController.getProductsByOrigin);
router.get('/home/search', checkSession, productController.searchProducts);

router.get('/:id/cart', checkSession, cartController.cart);
router.get('/order/:id', checkSession, cartController.order);
router.post('/cart', checkSession, cartController.addToCart);
router.delete('/cart/:id', checkSession, cartController.deleteToCart);
router.get('/cart/:id/increase', checkSession, cartController.increase);
router.get('/cart/:id/decrease', checkSession, cartController.decrease);
router.post('/cart/pay', checkSession, cartController.pay);

export default router;
