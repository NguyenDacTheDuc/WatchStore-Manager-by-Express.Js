import Product from '../../models/Product.js';
import Cart from '../../models/Cart.js';
import Order from '../../models/Order.js';
import OrderDetail from '../../models/OrderDetail.js';
import { getDataProduct } from '../../helper/getDataProduct.js';
import Employee from '../../models/Employee.js';
import Brand from '../../models/Brand.js';
import Category from '../../models/Category.js';
import Material from '../../models/Material.js';
import Origin from '../../models/Origin.js';

export const cartController = {
  addToCart: async (req, res) => {
    const productId = req.body.productId;
    const customerId = req.body.customerId;
    const quantity = req.body.quantity ? req.body.quantity : 1;
    try {
      const cart = await Cart.findOne({
        where: { productId, customerId },
      });
      if (cart) {
        cart.quantity += quantity;
        await cart.save();
      } else {
        await Cart.create({ productId, customerId, quantity });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  deleteToCart: async (req, res) => {
    const id = req.params.id;
    try {
      await Cart.destroy({ where: { id: id } });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  cart: async (req, res) => {
    const customerId = req.params.id;
    try {
      const cart = await Cart.findAll({
        where: { customerId },
        include: [Product],
      });
      const commonData = await getDataProduct();
      res.render('client/cart', { cart, ...commonData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  increase: async (req, res) => {
    const id = req.params.id;
    try {
      const item = await Cart.findByPk(id);
      item.quantity += 1;
      await item.save();
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  decrease: async (req, res) => {
    const id = req.params.id;
    try {
      const item = await Cart.findByPk(id);
      item.quantity -= 1;
      await item.save();
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  pay: async (req, res) => {
    const customerId = req.session.customer.id;
    try {
      const cart = await Cart.findAll({
        where: { customerId },
        include: [Product],
      });
      if (cart.length === 0) {
        return res.status(400).json({ error: 'Giỏ hàng trống!' });
      }
      let totalAmount = 0;
      for (const item of cart) {
        if (item.quantity > item.Product.quantity) {
          return res.status(400).json({
            error: `Sản phẩm "${item.Product.name}" chỉ còn ${item.Product.quantity} trong kho!`,
          });
        }
        totalAmount += item.Product.unitPrice * item.quantity;
      }
      const order = await Order.create({
        customerId,
        totalAmount,
      });
      for (const item of cart) {
        await OrderDetail.create({
          productId: item.Product.id,
          orderId: order.id,
          unitPrice: item.Product.unitPrice,
          quantity: item.quantity,
        });
        await Product.decrement('quantity', {
          by: item.quantity,
          where: { id: item.Product.id },
        });
      }
      await Cart.destroy({ where: { customerId } });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  order: async (req, res) => {
    const id = req.params.id;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Order.findAndCountAll({
        where: { customerId: id },
        include: [Employee],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const brands = await Brand.findAll();
      const categories = await Category.findAll();
      const materials = await Material.findAll();
      const origins = await Origin.findAll();
      res.render('client/order', {
        orders: rows,
        currentPage: page,
        totalPages,
        brands,
        categories,
        materials,
        origins,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
