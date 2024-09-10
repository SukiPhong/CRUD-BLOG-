'use strict';
import Express from "express";
import ConnectDB from "./Config/connectDB.js";
import initRouter from "./Routers/index.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = Express();
dotenv.config();
ConnectDB();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT || 8000;

initRouter(app);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
