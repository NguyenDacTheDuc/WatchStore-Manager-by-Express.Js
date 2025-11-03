import sequelize from "../config/database.js";
import BrandModel from "./Brand.js";
import CategoryModel from "./Category.js";
import CustomerModel from "./Customer.js";
import EmployeeModel from "./Employee.js";
import MaterialModel from "./Material.js";
import OrderModel from "./Order.js";
import OrderDetailModel from "./OrderDetail.js";
import OriginModel from "./Origin.js";
import ProductModel from "./Product.js";

const Brand = BrandModel(sequelize);
const Category = CategoryModel(sequelize);
const Customer = CustomerModel(sequelize);
const Employee = EmployeeModel(sequelize);
const Material = MaterialModel(sequelize);
const Origin = OriginModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const OrderDetail = OrderDetailModel(sequelize);

Brand.hasMany(Product, { foreignKey: "brandId", onDelete: "cascade" });
Product.belongsTo(Brand, { foreignKey: "brandId" });
Category.hasMany(Product, { foreignKey: "categoryId", onDelete: "cascade" });
Product.belongsTo(Category, { foreignKey: "categoryId" });
Material.hasMany(Product, { foreignKey: "materialId", onDelete: "cascade" });
Product.belongsTo(Material, { foreignKey: "materialId" });
Origin.hasMany(Product, { foreignKey: "originId", onDelete: "cascade" });
Product.belongsTo(Origin, { foreignKey: "originId" });
Employee.hasMany(Order, { foreignKey: "employeeId", onDelete: "set null" });
Order.belongsTo(Employee, { foreignKey: "employeeId" });
Customer.hasMany(Order, { foreignKey: "customerId", onDelete: "cascade" });
Order.belongsTo(Customer, { foreignKey: "customerId" });
Product.hasMany(OrderDetail, { foreignKey: "productId", onDelete: "cascade" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });
Order.hasMany(OrderDetail, { foreignKey: "orderId", onDelete: "cascade" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

export { Brand, Category, Customer, Employee, Material, Order, OrderDetail, Origin, Product };
