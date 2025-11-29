import sequelize from './database.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Customer from '../models/Customer.js';
import Employee from '../models/Employee.js';
import Material from '../models/Material.js';
import Origin from '../models/Origin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import OrderDetail from '../models/OrderDetail.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await Cart.sync({ alter: true });
    console.log('Table created/updated!');
    process.exit();
  } catch (error) {
    console.error('Unable to connect or create tables:', error);
    process.exit(1);
  }
})();
