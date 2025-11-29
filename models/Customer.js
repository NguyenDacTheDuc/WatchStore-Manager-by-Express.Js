import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Customer = sequelize.define(
  'Customer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Full name cannot be blank' },
        len: {
          args: [10, 100],
          msg: 'Độ dài tên ít nhất 10 và nhiều nhất 100 kí tự',
        },
        is: {
          args: /^[a-zA-ZÀ-ỹ\s]+$/u,
          msg: 'Tên chỉ được chứa chữ cái và khoảng trắng',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: { msg: 'Phone number already exists' },
      validate: {
        len: {
          args: [10, 10],
          msg: 'Phone number must be exactly 10 digits',
        },
        notEmpty: { msg: 'Phone number cannot be blank' },
        isNumeric: { msg: 'Phone number must contain only numbers' },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: { msg: 'Username already exists' },
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Username cannot be blank' },
        len: {
          args: [6, 50],
          msg: 'Username must be 6-50 characters',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password cannot be blank' },
        len: {
          args: [6, 100],
          msg: 'Password must be 6-100 characters',
        },
      },
    },
  },
  {
    tableName: 'customers',
    timestamps: true,
    hooks: {
      beforeCreate: async (customer) => {
        customer.password = await bcrypt.hash(customer.password, 10);
      },
      beforeUpdate: async (customer) => {
        if (customer.changed('password')) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
      },
    },
  }
);

export default Customer;
