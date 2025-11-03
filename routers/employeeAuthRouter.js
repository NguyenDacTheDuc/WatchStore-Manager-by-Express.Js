import express from "express";
import employeeAuthController from "../controllers/auth/employeeAuthController.js";
import { isAuthenticated, isAdmin, isEmployee } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", employeeAuthController.login);
router.post("/logout", employeeAuthController.logout);

router.get("/admin/dashboard", isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin Dashboard" });
});

router.get("/employee/profile", isAuthenticated, isEmployee, (req, res) => {
  res.json({ message: "Welcome Employee Profile" });
});

export default router;
