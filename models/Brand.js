import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Brand = sequelize.define(
  'Brand',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: { msg: 'Tên thương hiệu này đã tổn tại' },
      validate: {
        notEmpty: { msg: 'Không được bỏ trống' },
        len: {
          args: [3, 20],
          msg: 'Tên thương hiệu phải từ 3 đến 20 kí tự',
        },
      },
    },
  },
  {
    tableName: 'brands',
  }
);

export default Brand;
