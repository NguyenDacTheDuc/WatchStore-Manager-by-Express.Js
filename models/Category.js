import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: { msg: "This category already exists" },
      validate: {
        notEmpty: { msg: "Category name cannot be blank" },
        len: {
          args: [2, 50],
          msg: "Category name must be 2-50 characters",
        },
      },
    },
  },
  {
    tableName: "categorys",
  }
);

export default Category;
