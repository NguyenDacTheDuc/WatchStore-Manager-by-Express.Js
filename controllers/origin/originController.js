import Origin from '../../models/Origin.js';
import { Op } from 'sequelize';

export const originController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Origin.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);

      res.render('admin/origin', {
        origins: rows,
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
      let origin = await Origin.findOne({ where: { name: name } });
      if (origin) {
        return res.status(400).json({ error: 'Tên xuất xứ này đã tồn tại' });
      }
      await Origin.create({ name: name });
      return res
        .status(201)
        .json({ success: 'Đã thêm nơi xuất xứ thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    try {
      let origin = await Origin.findOne({
        where: { name: name, id: { [Op.ne]: id } },
      });
      if (origin) {
        return res.status(400).json({ error: 'Tên xuất xứ này đã tồn tại' });
      }
      await Origin.update({ name: name }, { where: { id: id } });
      return res.status(200).json({ success: 'Đã sửa dữ liệu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await Origin.destroy({ where: { id: id } });
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
