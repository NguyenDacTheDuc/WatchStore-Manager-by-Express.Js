import Material from '../../models/Material.js';
import { Op } from 'sequelize';

export const materialController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Material.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);

      res.render('admin/material', {
        materials: rows,
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
      let material = await Material.findOne({ where: { name: name } });
      if (material) {
        return res.status(400).json({ error: 'Tên nhiên liệu này đã tồn tại' });
      }
      await Material.create({ name: name });
      return res.status(201).json({ success: 'Đã thêm nhiên liệu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    try {
      let material = await Material.findOne({
        where: { name: name, id: { [Op.ne]: id } },
      });
      if (material) {
        return res.status(400).json({ error: 'Tên nhiên liệu này đã tồn tại' });
      }
      await Material.update({ name: name }, { where: { id: id } });
      return res.status(200).json({ success: 'Đã sửa dữ liệu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await Material.destroy({ where: { id: id } });
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
