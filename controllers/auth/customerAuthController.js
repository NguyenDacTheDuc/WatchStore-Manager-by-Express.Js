import bcrypt from 'bcrypt';
import Brand from '../../models/Brand.js';
import Category from '../../models/Category.js';
import Product from '../../models/Product.js';
import Material from '../../models/Material.js';
import Origin from '../../models/Origin.js';
import Customer from '../../models/Customer.js';

export const customerAuthController = {
  login: async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
      let customer = await Customer.findOne({ where: { username: username } });
      if (!customer) {
        return res.status(401).json({ error: 'Tài khoảng của bạn không tồn tại' });
      }
      let passwordcheck = await bcrypt.compare(password, customer.password);
      if (!passwordcheck) {
        return res.status(401).json({ error: 'Sai mật khẩu' });
      }
      req.session.customer = customer;
      return res.status(200).json({
        url: '/home',
      });
    } catch (err) {
      onsole.error(err);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      return res.status(200).json({
        url: '/',
      });
    });
  },

  register: async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    try {
      const existingUsername = await Customer.findOne({
        where: { username: username },
      });
      if (existingUsername) {
        return res.status(409).json({ error: 'Tài khoản này đã tồn tại' });
      }
      const existingPhone = await Customer.findOne({
        where: { phone: phone },
      });
      if (existingPhone) {
        return res.status(409).json({ error: 'Số điện thoại này đã đăng ký' });
      }
      await Customer.create({
        name: name,
        username: username,
        password: password,
        phone: phone,
        address: address,
      });
      return res.status(201).json({
        success: 'Đăng ký thành công, hãy quay trở lại trang đăng nhập.',
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: err.errors[0].message });
      }
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  forgetPassword: async (req, res) => {
    const username = req.body.username;
    const phone = req.body.phone;
    try {
      let customer = await Customer.findOne({ where: { username: username, phone: phone } });
      if (!customer) {
        return res.status(401).json({ error: 'Tài khoảng hoặc số điện thoại không đúng' });
      }
      customer.password = phone;
      await customer.save();
      res.status(200).json({
        success: 'Mật khẩu mới chính là số điện thoại của bạn.',
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: err.errors[0].message });
      }
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
