import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const sequelize = new Sequelize(process.env.NAME_DB, process.env.USER_DB, process.env.PASS_DB, {
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  dialect: process.env.DIALECT_DB,
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  timezone: '+07:00',
});

export default sequelize;
