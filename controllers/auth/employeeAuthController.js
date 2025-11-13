import bcrypt from 'bcrypt';
import Employee from '../../models/Employee.js';

const employeeAuthController = {
  login: async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
      let employee = await Employee.findOne({ where: { username: username } });
      if (!employee) {
        return res.status(401).json({ error: 'Tài khoảng của bạn không tồn tại' });
      }
      let passwordcheck = await bcrypt.compare(password, employee.password);
      if (!passwordcheck) {
        return res.status(401).json({ error: 'Sai mật khẩu' });
      }
      req.session.employee = employee;
      return res.status(200).json({
        redirectUrl: '/admin/dashboard',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      return res.status(200).json({
        redirectUrl: '/admin',
      });
    });
  },

  resetPassword: async (req, res) => {
    let username = req.body.username;
    let phone = req.body.phone;
    try {
      const employee = await Employee.findOne({
        where: {
          username: username,
          phone: phone,
        },
      });
      if (!employee) {
        return res.status(401).json({ error: 'Nhân viên này không tồn tại' });
      }
      employee.password = phone;
      await employee.save();
      res.status(200).json({
        success: 'Mật khẩu đã được reset lại thành số điện thoại của bạn',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },

  changePassword: async (req, res) => {
    const id = req.params.id;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    try {
      const employee = await Employee.findByPk(id);
      const match = await bcrypt.compare(password, employee.password);
      if (!match) {
        return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });
      }
      employee.password = newPassword;
      await employee.save();
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Có lỗi xảy ra, thử lại sau' });
    }
  },
};

export default employeeAuthController;
