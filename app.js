import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import employeeRouter from './routers/employeeRouter.js';
import customerRouter from './routers/customerRouter.js';
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
app.use('/uploads', express.static('uploads'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', customerRouter);
app.use('/admin', employeeRouter);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
