import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Material from '../models/Material.js';
import Origin from '../models/Origin.js';
import Customer from '../models/Customer.js';

export const getDataProduct = async () => {
  const brands = await Brand.findAll();
  const categories = await Category.findAll();
  const materials = await Material.findAll();
  const origins = await Origin.findAll();
  const customers = await Customer.findAll();
  return { brands, categories, materials, origins, customers };
};
