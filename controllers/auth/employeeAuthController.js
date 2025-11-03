import bcrypt from "bcrypt";
import Employee from "../../models/Employee.js";

const employeeAuthController = {
  login: async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
      let employee = await Employee.findOne({ where: { username: username } });
      if (!employee) {
        return res.status(401).json({ error: "Username not found" });
      }
      let passwordcheck = await bcrypt.compare(password, employee.password);
      if (!passwordcheck) {
        return res.status(401).json({ error: "Incorrect password" });
      }
      req.session.employee = employee;
      return res
        .status(200)
        .json({ message: "Login successful", employeeId: employee.id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      return res.status(200).json({ message: "Logout successful" });
    });
  },
};

export default employeeAuthController;
