import { Op } from 'sequelize';
import Employee from '../../models/Employee.js';
import bcrypt from 'bcrypt';

export const employeeController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Employee.findAndCountAll({
        where: { role: { [Op.ne]: 'admin' } },
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);

      res.render('admin/employee', {
        employees: rows,
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
      const { count, rows } = await Employee.findAndCountAll({
        where: {
          name: { [Op.like]: `%${keyword}%` },
          role: { [Op.ne]: 'admin' },
        },
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      res.render('admin/employee', {
        employees: rows,
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
      res.render('admin/newEmployee');
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  edit: async (req, res) => {
    const id = req.params.id;
    try {
      const employee = await Employee.findByPk(id);
      res.render('admin/editEmployee', { employee });
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
      const employee = await Employee.findOne({
        where: { username: username },
      });
      if (employee) {
        return res.status(500).json({ error: 'Nhân viên này đã tồn tại' });
      }
      await Employee.create({ name, phone, username, password, address });
      res.status(201).json({ url: '/admin/employee' });
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
      let employee = await Employee.findOne({
        where: { username: username, id: { [Op.ne]: id } },
      });
      if (employee) {
        return res.status(400).json({ error: 'Tên tài khoản này đã tồn tại' });
      }
      const updateData = { name, phone, username, address };
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      await Employee.update(updateData, { where: { id: id } });
      return res.status(200).json({ url: '/admin/employee' });
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
      await Employee.destroy({ where: { id: id } });
      res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
