import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Customer = sequelize.define(
  "Customer",
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
        notEmpty: { msg: "Full name cannot be blank" },
        len: {
          args: [10, 100],
          msg: "Full name must be 10-100 characters",
        },
        is: {
          args: /^[A-Za-zÀ-ỹ\s]+$/u,
          msg: "Full name can only contain letters and spaces",
        },
      },
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: { msg: "Phone number already exists" },
      validate: {
        len: {
          args: [10, 10],
          msg: "Phone number must be exactly 10 digits",
        },
        notEmpty: { msg: "Phone number cannot be blank" },
        isNumeric: { msg: "Phone number must contain only numbers" },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Address cannot be blank" },
        len: {
          args: [6, 255],
          msg: "Address must be 6-255 characters",
        },
      },
    },
    username: {
      type: DataTypes.STRING(50),
      unique: { msg: "Username already exists" },
      allowNull: false,
      validate: {
        notEmpty: { msg: "Username cannot be blank" },
        len: {
          args: [6, 50],
          msg: "Username must be 6-50 characters",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be blank" },
        len: {
          args: [6, 100],
          msg: "Password must be 6-100 characters",
        },
      },
    },
  },
  {
    tableName: "customers",
    timestamps: true,
    hooks: {
      beforeCreate: async (customer) => {
        customer.pass = await bcrypt.hash(customer.pass, 10);
      },
      beforeUpdate: async (customer) => {
        if (customer.changed("pass")) {
          customer.pass = await bcrypt.hash(customer.pass, 10);
        }
      },
    },
  }
);

export default Customer;
