import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Material = sequelize.define(
  "Material",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      unique: { msg: "This Material already exists" },
      allowNull: false,
      validate: {
        notEmpty: { msg: "Material name cannot be blank" },
        len: {
          args: [3, 20],
          msg: "Material name must be 3-20 characters",
        },
      },
    },
  },
  {
    tableName: "materials",
  }
);

export default Material;
