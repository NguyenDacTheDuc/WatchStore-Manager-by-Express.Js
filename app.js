import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
