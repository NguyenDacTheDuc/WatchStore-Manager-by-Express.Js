import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Product from "./Product.js";
import Order from "./Order.js";

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Product is required" },
        isInt: { msg: "Product ID must be an integer" },
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Order is required" },
        isInt: { msg: "Order ID must be an integer" },
      },
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Unit price is required" },
        isInt: { msg: "Unit price must be an integer" },
        min: {
          args: [100000],
          msg: "Unit price must be at least 100,000 VND",
        },
        max: {
          args: [10000000],
          msg: "Unit price cannot exceed 10,000,000 VND",
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Quantity is required" },
        isInt: { msg: "Quantity must be an integer" },
        min: {
          args: [1],
          msg: "Quantity must be at least 1",
        },
        max: {
          args: [100],
          msg: "Quantity cannot exceed 100 units per order",
        },
      },
    },
  },
  {
    tableName: "orderdetails",
    timestamps: true,
  }
);

Product.hasMany(OrderDetail, { foreignKey: "productId", onDelete: "cascade" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

Order.hasMany(OrderDetail, { foreignKey: "orderId", onDelete: "cascade" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

export default OrderDetail;
