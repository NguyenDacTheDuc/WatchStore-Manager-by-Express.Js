import Brand from '../../models/Brand.js';
import Category from '../../models/Category.js';
import Material from '../../models/Material.js';
import Origin from '../../models/Origin.js';
import Product from '../../models/Product.js';
import Customer from '../../models/Customer.js';

export const productController = {
  home: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [Brand, Category, Material, Origin],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const brands = await Brand.findAll();
      const categories = await Category.findAll();
      const materials = await Material.findAll();
      const origins = await Origin.findAll();
      const customers = await Customer.findAll();
      res.render('client/home', { products: rows, currentPage: page, totalPages, brands, categories, materials, origins, customers });
    } catch (err) {
      console.error(err);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },
};
