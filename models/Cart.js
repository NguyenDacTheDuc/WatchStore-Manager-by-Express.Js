import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './Product.js';
import Customer from './Customer.js';

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: 'carts',
    timestamps: true,
  }
);

Customer.hasMany(Cart, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Cart.belongsTo(Customer, { foreignKey: 'customerId' });

Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

export default Cart;
