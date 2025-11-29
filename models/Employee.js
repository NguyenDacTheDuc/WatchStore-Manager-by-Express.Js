import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define(
  'Employee',
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
          msg: 'Full name must be 10-100 characters',
        },
        is: {
          args: /^[A-Za-zÀ-ỹ\s]+$/u,
          msg: 'Full name can only contain letters and spaces',
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
    role: {
      type: DataTypes.ENUM('admin', 'employee'),
      defaultValue: 'employee',
      allowNull: false,
      validate: {
        isIn: {
          args: [['admin', 'employee']],
          msg: 'Role must be either admin or employee',
        },
      },
    },
  },
  {
    tableName: 'employees',
    timestamps: true,
    hooks: {
      beforeCreate: async (employee) => {
        employee.password = await bcrypt.hash(employee.password, 10);
      },
      beforeUpdate: async (employee) => {
        if (employee.changed('password')) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      },
    },
  }
);

export default Employee;
