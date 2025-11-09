import Brand from '../../models/Brand.js';
import Category from '../../models/Category.js';
import Material from '../../models/Material.js';
import Origin from '../../models/Origin.js';
import Product from '../../models/Product.js';
import { Op } from 'sequelize';

export const productController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [
          { model: Brand },
          { model: Category },
          { model: Material },
          { model: Origin },
        ],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);

      res.render('admin/product', {
        products: rows,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  new: async (req, res) => {
    try {
      const brands = await Brand.findAll();
      const categories = await Category.findAll();
      const materials = await Material.findAll();
      const origins = await Origin.findAll();
      res.render('admin/newProduct', {
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
  create: async (req, res) => {},
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
  search: async (req, res) => {},
};
