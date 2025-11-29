import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Brand from './Brand.js';
import Category from './Category.js';
import Origin from './Origin.js';
import Material from './Material.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Brand is required' },
        isInt: { msg: 'Brand ID must be an integer' },
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Category is required' },
        isInt: { msg: 'Category ID must be an integer' },
      },
    },
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Material is required' },
        isInt: { msg: 'Material ID must be an integer' },
      },
    },
    originId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Origin is required' },
        isInt: { msg: 'Origin ID must be an integer' },
      },
    },
    name: {
      type: DataTypes.STRING(100),
      unique: { msg: 'Product name already exists' },
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Product name cannot be blank' },
        len: {
          args: [10, 100],
          msg: 'Product name must be 10-100 characters',
        },
        is: {
          args: /^[A-Za-z0-9À-ỹ\s\-_.,()]+$/u,
          msg: 'Product name can only contain letters, numbers, spaces and special characters: - _ . , ( )',
        },
      },
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Color cannot be blank' },
        len: {
          args: [2, 10],
          msg: 'Color must be 2-10 characters',
        },
        is: {
          args: /^[\p{L}\s]+$/u,
          msg: 'Color can only contain letters and spaces',
        },
      },
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Unit price cannot be blank' },
        isInt: { msg: 'Unit price must be an integer' },
        min: {
          args: [100000],
          msg: 'Unit price must be at least 100,000 VND',
        },
        max: {
          args: [10000000],
          msg: 'Unit price cannot exceed 10,000,000 VND',
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Quantity cannot be blank' },
        isInt: { msg: 'Quantity must be an integer' },
      },
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Picture filename already exists' },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Description cannot be blank' },
        len: {
          args: [20, 2000],
          msg: 'Description must be 20-2000 characters',
        },
      },
    },
  },
  {
    tableName: 'products',
    timestamps: true,
  }
);

Brand.hasMany(Product, { foreignKey: 'brandId', onDelete: 'cascade' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'cascade' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Material.hasMany(Product, { foreignKey: 'materialId', onDelete: 'cascade' });
Product.belongsTo(Material, { foreignKey: 'materialId' });

Origin.hasMany(Product, { foreignKey: 'originId', onDelete: 'cascade' });
Product.belongsTo(Origin, { foreignKey: 'originId' });

export default Product;
