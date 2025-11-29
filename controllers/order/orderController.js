import Order from '../../models/Order.js';
import Customer from '../../models/Customer.js';
import Product from '../../models/Product.js';
import OrderDetail from '../../models/OrderDetail.js';

export const orderController = {
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Order.findAndCountAll({
        where: { status: 'pending' },
        include: [Customer],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      res.render('admin/orderBrowse', {
        orders: rows,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  show: async (req, res) => {
    const id = req.params.id;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await OrderDetail.findAndCountAll({
        where: { orderId: id },
        include: [Product],
        limit,
        offset,
        order: [['id', 'ASC']],
      });
      const totalPages = Math.ceil(count / limit);
      res.render('admin/orderDetail', { orderDetails: rows, currentPage: page, totalPages, id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  confirm: async (req, res) => {
    const employeeId = req.session.employee.id;
    const id = req.body.orderId;
    try {
      const order = await Order.findByPk(id);
      order.employeeId = employeeId;
      order.status = 'confirmed';
      await order.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};
