import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import employeeAuthController from '../controllers/auth/employeeAuthController.js';
import { checkSession } from '../middlewares/checkSessionAdmin.js';
import { brandController } from '../controllers/brand/brandController.js';
import { categoryController } from '../controllers/category/categoryController.js';
import { materialController } from '../controllers/material/materialController.js';
import { originController } from '../controllers/origin/originController.js';
import { productController } from '../controllers/product/productController.js';

const router = express.Router();

//auth
router.get('/', (req, res) => {
  res.render('admin/login');
});

router.post('/login', employeeAuthController.login);
router.post('/logout', employeeAuthController.logout);

router.get('/forget-password', (req, res) => {
  res.render('admin/forgetPassword');
});
router.post('/forget-password', employeeAuthController.resetPassword);

//dashboard
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

//management
router.get('/brand', checkSession, brandController.list);
router.post('/brand', checkSession, brandController.create);
router.put('/brand/:id', checkSession, brandController.update);
router.delete('/brand/:id', checkSession, brandController.delete);

router.get('/category', checkSession, categoryController.list);
router.post('/category', checkSession, categoryController.create);
router.put('/category/:id', checkSession, categoryController.update);
router.delete('/category/:id', checkSession, categoryController.delete);

router.get('/material', checkSession, materialController.list);
router.post('/material', checkSession, materialController.create);
router.put('/material/:id', checkSession, materialController.update);
router.delete('/material/:id', checkSession, materialController.delete);

router.get('/origin', checkSession, originController.list);
router.post('/origin', checkSession, originController.create);
router.put('/origin/:id', checkSession, originController.update);
router.delete('/origin/:id', checkSession, originController.delete);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get('/product', checkSession, productController.list);
router.get('/product/new', checkSession, productController.new);
router.post(
  '/product',
  checkSession,
  upload.single('image'),
  productController.create
);
// router.put('/product:id', checkSession, productController.update);
// router.delete('/product:id', checkSession, productController.delete);

export default router;
