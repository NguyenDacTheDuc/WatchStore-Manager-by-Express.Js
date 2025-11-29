import Brand from '../../models/Brand.js';
import Category from '../../models/Category.js';
import Customer from '../../models/Customer.js';
import Material from '../../models/Material.js';
import Origin from '../../models/Origin.js';
import bcrypt from 'bcrypt';

export const profileController = {
  profile: async (req, res) => {
    try {
      const brands = await Brand.findAll();
      const categories = await Category.findAll();
      const materials = await Material.findAll();
      const origins = await Origin.findAll();
      res.render('client/profile', { brands, categories, materials, origins });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  updateProfile: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    try {
      const customer = await Customer.findByPk(id);
      customer.name = name;
      customer.phone = phone;
      customer.address = address;
      await customer.update({ name, phone, address }, { where: { id } });
      res.status(200).json({ success: 'Cập nhật thông tin thành công' });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: err.errors[0].message });
      }
      res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const brands = await Brand.findAll();
      const categories = await Category.findAll();
      const materials = await Material.findAll();
      const origins = await Origin.findAll();
      res.render('client/changePassword', { brands, categories, materials, origins });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  change: async (req, res) => {
    const id = req.params.id;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    try {
      const customer = await Customer.findByPk(id);
      const match = await bcrypt.compare(password, customer.password);
      if (!match) {
        return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
      }
      customer.password = newPassword;
      await customer.save();
      res.status(200).json({ success: 'Đổi mật khẩu thành công' });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: err.errors[0].message });
      }
      res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
