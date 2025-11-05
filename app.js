import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import employeeAuthRouter from "./routers/employeeAuthRouter.js";
import session from "express-session";

dotenv.config();
const app = express();

app.use(
  session({
    secret: "your-secret-key-here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("admin/login");
});

app.use("/auth", employeeAuthRouter);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
