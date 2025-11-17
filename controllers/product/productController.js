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
        include: [Brand, Category, Material, Origin],
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

  nameSearch: async (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : '';
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        include: [Brand, Category, Material, Origin],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      res.render('admin/product', {
        products: rows,
        currentPage: page,
        totalPages,
        keyword,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  brandSearch: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const keyword = req.query.keyword ? req.query.keyword.trim() : '';
      const { count, rows } = await Product.findAndCountAll({
        include: [
          {
            model: Brand,
            where: {
              name: { [Op.like]: `%${keyword}%` },
            },
            required: true,
          },
          Category,
          Material,
          Origin,
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
        keyword,
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

  show: async (req, res) => {
    const id = req.params.id;
    try {
      const product = await Product.findByPk(id, {
        include: [Brand, Category, Material, Origin],
      });
      res.render('admin/productDetail', {
        product,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  edit: async (req, res) => {
    const id = req.params.id;
    try {
      const brands = await Brand.findAll();
      const categories = await Category.findAll();
      const materials = await Material.findAll();
      const origins = await Origin.findAll();
      const product = await Product.findByPk(id, {
        include: [Brand, Category, Material, Origin],
      });
      res.render('admin/editProduct.ejs', {
        product,
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

  create: async (req, res) => {
    const name = req.body.name;
    const color = req.body.color;
    const brandId = parseInt(req.body.brandId);
    const categoryId = parseInt(req.body.categoryId);
    const materialId = parseInt(req.body.materialId);
    const originId = parseInt(req.body.originId);
    const unitPrice = parseFloat(req.body.unitPrice);
    const quantity = parseInt(req.body.quantity);
    const picture = req.file;
    const description = req.body.description;
    try {
      await Product.create({
        name: name,
        color: color,
        brandId: brandId,
        materialId: materialId,
        categoryId: categoryId,
        originId: originId,
        unitPrice: unitPrice,
        quantity: quantity,
        description: description,
        picture: '/uploads/' + picture.filename,
      });
      return res.status(201).json({ url: '/admin/product' });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: err.errors[0].message });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const color = req.body.color;
    const brandId = parseInt(req.body.brandId);
    const categoryId = parseInt(req.body.categoryId);
    const materialId = parseInt(req.body.materialId);
    const originId = parseInt(req.body.originId);
    const unitPrice = parseFloat(req.body.unitPrice);
    const quantity = parseInt(req.body.quantity);
    const picture = req.file ? '/uploads/' + req.file.filename : req.body.oldImage;
    const description = req.body.description;
    try {
      let product = await Product.findOne({
        where: { name: name, id: { [Op.ne]: id } },
      });
      if (product) {
        return res.status(400).json({ error: 'Tên sản phẩm này đã tồn tại' });
      }
      await Product.update(
        {
          name: name,
          color: color,
          brandId: brandId,
          materialId: materialId,
          categoryId: categoryId,
          originId: originId,
          unitPrice: unitPrice,
          quantity: quantity,
          description: description,
          picture: picture,
        },
        { where: { id: id } }
      );
      return res.status(200).json({ url: '/admin/product' });
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: 'Server error' });
    }
  },

  delete: async (req, res) => {
    const id = req.params.id;
    try {
      await Product.destroy({ where: { id: id } });
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
  search: async (req, res) => {},
};
