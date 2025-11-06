import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import employeeRouter from './routers/employeeAuthRouter.js';
import session from 'express-session';

dotenv.config();
const app = express();

app.use(
  session({
    secret: 'your-secret-key-here',
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
app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/admin', employeeRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Server running at http://localhost:${process.env.PORT}/admin`
  );
});
