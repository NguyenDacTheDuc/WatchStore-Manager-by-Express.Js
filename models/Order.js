import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Employee from './Employee.js';
import Customer from './Customer.js';

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: { msg: 'Employee ID must be an integer' },
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Customer is required' },
        isInt: { msg: 'Customer ID must be an integer' },
      },
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: 'Order date is required' },
        isDate: { msg: 'Order date must be a valid date' },
        isBefore: {
          args: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          msg: 'Order date cannot be in the future',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered'),
      defaultValue: 'pending',
      allowNull: false,
      validate: {
        notNull: { msg: 'Order status is required' },
        isIn: {
          args: [['pending', 'confirmed', 'shipping', 'delivered']],
          msg: 'Status must be: pending, confirmed, shipping, delivered, or cancelled',
        },
      },
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Total amount is required' },
        isInt: { msg: 'Total amount must be an integer' },
      },
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
  }
);

Employee.hasMany(Order, { foreignKey: 'employeeId', onDelete: 'set null' });
Order.belongsTo(Employee, { foreignKey: 'employeeId' });

Customer.hasMany(Order, { foreignKey: 'customerId', onDelete: 'cascade' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

export default Order;
