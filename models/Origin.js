import { DataTypes } from "sequelize";

const origin = (sequelize) => {
  const o = sequelize.define(
    "Origin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: { msg: "This origin already exists" },
        validate: {
          notEmpty: { msg: "Origin name cannot be blank" },
          len: {
            args: [2, 20],
            msg: "Origin name must be 3-20 characters",
          },
        },
      },
    },
    {
      tableName: "origins",
    }
  );
  return o;
};

export default origin;
