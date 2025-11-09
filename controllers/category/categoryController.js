import Category from '../../models/Category.js';
import { Op } from 'sequelize';

export const categoryController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Category.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);

      res.render('admin/category', {
        categories: rows,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  create: async (req, res) => {
    const name = req.body.name;
    try {
      let category = await Category.findOne({ where: { name: name } });
      if (category) {
        return res.status(400).json({ error: 'Tên thể loại này đã tồn tại' });
      }
      await Category.create({ name: name });
      return res.status(201).json({ success: 'Đã thêm thể loại thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    try {
      let category = await Category.findOne({
        where: { name: name, id: { [Op.ne]: id } },
      });
      if (category) {
        return res.status(400).json({ error: 'Tên thể loại này đã tồn tại' });
      }
      await Category.update({ name: name }, { where: { id: id } });
      return res.status(200).json({ success: 'Đã sửa dữ liệu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await Category.destroy({ where: { id: id } });
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
