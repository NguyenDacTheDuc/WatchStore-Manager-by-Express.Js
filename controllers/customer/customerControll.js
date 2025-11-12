import { Op } from 'sequelize';
import Customer from '../../models/Customer.js';
import bcrypt from 'bcrypt';

export const customerController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Customer.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);

      res.render('admin/customer', {
        customers: rows,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  name: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const keyword = req.query.keyword ? req.query.keyword.trim() : '';
      const { count, rows } = await Customer.findAndCountAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      res.render('admin/customer', {
        customers: rows,
        currentPage: page,
        totalPages,
        keyword,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  new: (req, res) => {
    try {
      res.render('admin/newCustomer');
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  edit: async (req, res) => {
    const id = req.params.id;
    try {
      const customer = await Customer.findByPk(id);
      res.render('admin/editCustomer', { customer });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  create: async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    try {
      const customer = await Customer.findOne({
        where: { username: username },
      });
      if (customer) {
        return res.status(500).json({ error: 'Khách hàng này đã tồn tại' });
      }
      await Customer.create({ name, phone, username, password, address });
      res.status(201).json({ url: '/admin/customer' });
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const phone = req.body.phone;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    try {
      let customer = await Customer.findOne({
        where: { username: username, id: { [Op.ne]: id } },
      });
      if (customer) {
        return res.status(400).json({ error: 'Tên tài khoản này đã tồn tại' });
      }
      const updateData = { name, phone, username, address };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      await Customer.update(updateData, { where: { id: id } });
      return res.status(200).json({ url: '/admin/customer' });
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await Customer.destroy({ where: { id: id } });
      res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
