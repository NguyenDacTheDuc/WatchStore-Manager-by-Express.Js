import Product from '../../models/Product.js';
import { getDataProduct } from '../../helper/getDataProduct.js';
import { Op } from 'sequelize';
import Brand from '../../models/Brand.js';
import Category from '../../models/Category.js';
import Material from '../../models/Material.js';
import Origin from '../../models/Origin.js';
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
      const commonData = await getDataProduct();
      res.render('client/home', { products: rows, currentPage: page, totalPages, ...commonData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  getProductsByBrand: async (req, res) => {
    const id = req.params.id;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [
          {
            model: Brand,
            where: { id: id },
            required: true,
          },
          Brand,
          Category,
          Material,
          Origin,
        ],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const commonData = await getDataProduct();
      res.render('client/productFilter', { products: rows, currentPage: page, totalPages, ...commonData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  getProductsByCategory: async (req, res) => {
    const id = req.params.id;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [
          {
            model: Category,
            where: { id: id },
            required: true,
          },
          Brand,
          Category,
          Material,
          Origin,
        ],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const commonData = await getDataProduct();
      res.render('client/productFilter', { products: rows, currentPage: page, totalPages, ...commonData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  getProductsByMaterial: async (req, res) => {
    const id = req.params.id;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [
          {
            model: Material,
            where: { id: id },
            required: true,
          },
          Brand,
          Category,
          Material,
          Origin,
        ],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const commonData = await getDataProduct();
      res.render('client/productFilter', { products: rows, currentPage: page, totalPages, ...commonData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  getProductsByOrigin: async (req, res) => {
    const id = req.params.id;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        include: [
          {
            model: Origin,
            where: { id: id },
            required: true,
          },
          Brand,
          Category,
          Material,
          Origin,
        ],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const commonData = await getDataProduct();
      res.render('client/productFilter', { products: rows, currentPage: page, totalPages, ...commonData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  searchProducts: async (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : '';
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        where: { name: { [Op.like]: `%${keyword}%` } },
        include: [Brand, Category, Material, Origin],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      const commonData = await getDataProduct();
      res.render('client/home', { products: rows, currentPage: page, totalPages, ...commonData });
    } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },

  productDetail: async (req, res) => {
    const id = req.params.id;
    try {
      const product = await Product.findByPk(id, {
        include: [Brand, Category, Material, Origin],
      });
      const commonData = await getDataProduct();
      res.render('client/productDetail', { product, ...commonData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Có lỗi xảy ra, thử lại sau');
    }
  },
};
