import { DataTypes } from "sequelize";

const brand = (sequelize) => {
  const b = sequelize.define(
    "Brand",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: { msg: "This brand already exists" },
        validate: {
          notEmpty: { msg: "Brand name cannot be blank" },
          len: {
            args: [3, 20],
            msg: "Brand name must be 3-20 characters",
          },
        },
      },
    },
    {
      tableName: "brands",
    }
  );
  return b;
};

export default brand;
