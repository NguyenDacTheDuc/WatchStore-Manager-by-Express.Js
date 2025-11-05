import sequelize from "./config/database.js";
import Brand from "./models/Brand.js";
import Category from "./models/Category.js";
import Customer from "./models/Customer.js";
import Employee from "./models/Employee.js";
import Material from "./models/Material.js";
import Origin from "./models/Origin.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import OrderDetail from "./models/OrderDetail.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ alter: true });
    console.log("All tables created/updated!");
    process.exit();
  } catch (error) {
    console.error("Unable to connect or create tables:", error);
    process.exit(1);
  }
})();
