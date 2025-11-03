import { DataTypes } from "sequelize";

const order = (sequelize) => {
  const o = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: "Employee ID must be an integer" },
        },
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Customer is required" },
          isInt: { msg: "Customer ID must be an integer" },
        },
      },
      orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        validate: {
          notNull: { msg: "Order date is required" },
          isDate: { msg: "Order date must be a valid date" },
          isBefore: {
            args: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            msg: "Order date cannot be in the future",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "shipping", "delivered", "cancelled"),
        defaultValue: "pending",
        allowNull: false,
        validate: {
          notNull: { msg: "Order status is required" },
          isIn: {
            args: [["pending", "confirmed", "shipping", "delivered", "cancelled"]],
            msg: "Status must be: pending, confirmed, shipping, delivered, or cancelled",
          },
        },
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          notNull: { msg: "Total amount is required" },
          isDecimal: { msg: "Total amount must be a decimal number" },
          min: {
            args: [0],
            msg: "Total amount cannot be negative",
          },
          max: {
            args: [1000000000], // 1 billion
            msg: "Total amount cannot exceed 1,000,000,000",
          },
        },
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Shipping address cannot be blank" },
          len: {
            args: [10, 500],
            msg: "Shipping address must be 10-500 characters",
          },
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM("cash", "credit_card", "bank_transfer", "e_wallet"),
        defaultValue: "cash",
        allowNull: false,
        validate: {
          notNull: { msg: "Payment method is required" },
          isIn: {
            args: [["cash", "credit_card", "bank_transfer", "e_wallet"]],
            msg: "Payment method must be: cash, credit_card, bank_transfer, or e_wallet",
          },
        },
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
        defaultValue: "pending",
        allowNull: false,
        validate: {
          notNull: { msg: "Payment status is required" },
          isIn: {
            args: [["pending", "paid", "failed", "refunded"]],
            msg: "Payment status must be: pending, paid, failed, or refunded",
          },
        },
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );
  return o;
};

export default order;
