import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import employeeAuthController from '../controllers/auth/employeeAuthController.js';
import { checkSession } from '../middlewares/checkSessionAdmin.js';
import { brandController } from '../controllers/brand/brandController.js';
import { categoryController } from '../controllers/category/categoryController.js';
import { materialController } from '../controllers/material/materialController.js';
import { originController } from '../controllers/origin/originController.js';
import { productController } from '../controllers/product/productController.js';
import { customerController } from '../controllers/customer/customerControll.js';
import { employeeController } from '../controllers/employee/employeeController.js';
import { orderController } from '../controllers/order/orderController.js';

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

router.get('/dashboard', checkSession, (req, res) => {
  res.render('admin/home');
});

router.get('/:id/change-password', checkSession, (req, res) => {
  res.render('admin/changePassword');
});
router.post('/:id/change-password', checkSession, employeeAuthController.changePassword);

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Picture must be a valid image file (jpg, jpeg, png, webp)'));
  }
};
const upload = multer({ storage, fileFilter });

router.get('/product', checkSession, productController.list);
router.get('/product/new', checkSession, productController.new);
router.get('/product/name-search', checkSession, productController.nameSearch);
router.get('/product/brand-search', checkSession, productController.brandSearch);
router.get('/product/:id/', checkSession, productController.show);
router.get('/product/:id/edit', checkSession, productController.edit);

router.post('/product', checkSession, upload.single('image'), productController.create);
router.put('/product/:id', checkSession, upload.single('image'), productController.update);
router.delete('/product/:id', checkSession, productController.delete);

router.get('/customer', checkSession, customerController.list);
router.get('/customer/new', checkSession, customerController.new);
router.get('/customer/name', checkSession, customerController.name);
router.get('/customer/:id/edit', checkSession, customerController.edit);
router.post('/customer', checkSession, customerController.create);
router.put('/customer/:id', checkSession, customerController.update);
router.delete('/customer/:id', checkSession, customerController.delete);

router.get('/employee', checkSession, employeeController.list);
router.get('/employee/new', checkSession, employeeController.new);
router.get('/employee/name', checkSession, employeeController.name);
router.get('/employee/:id/edit', checkSession, employeeController.edit);
router.post('/employee', checkSession, employeeController.create);
router.put('/employee/:id', checkSession, employeeController.update);
router.delete('/employee/:id', checkSession, employeeController.delete);

router.get('/order', checkSession, orderController.list);
router.get('/order/:id', checkSession, orderController.show);
router.post('/order/confirm', checkSession, orderController.confirm);

export default router;
