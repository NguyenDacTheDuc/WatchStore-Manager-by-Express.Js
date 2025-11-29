import Brand from '../../models/Brand.js';
import { Op } from 'sequelize';

export const brandController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10; // Mỗi trang 10 record
      const offset = (page - 1) * limit;

      // Lấy tổng + dữ liệu
      const { count, rows } = await Brand.findAndCountAll({
        limit,
        offset,
        order: [['id', 'ASC']],
      });

      // Tính tổng số trang
      const totalPages = Math.ceil(count / limit);

      res.render('admin/brand', {
        brands: rows,
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
      let brand = await Brand.findOne({ where: { name: name } });
      if (brand) {
        return res
          .status(400)
          .json({ error: 'Tên thương hiệu này đã tồn tại' });
      }
      await Brand.create({ name: name });
      return res
        .status(201)
        .json({ success: 'Đã thêm thương hiệu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    try {
      let brand = await Brand.findOne({
        where: { name: name, id: { [Op.ne]: id } },
      });
      if (brand) {
        return res
          .status(400)
          .json({ error: 'Tên thương hiệu này đã tồn tại' });
      }
      await Brand.update({ name: name }, { where: { id: id } });
      return res.status(200).json({ success: 'Đã sửa dữ liệu thành công' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await Brand.destroy({ where: { id: id } });
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
