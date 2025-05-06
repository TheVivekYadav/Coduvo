import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = express();

// to accept json related body
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello Guys welcome to leetlab🔥\n");
})

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT, ()=>{
  console.log(`Server is running on port:${process.env.PORT}`);
})
