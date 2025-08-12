import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8800;
import { emailConsumer } from "./consumer";

emailConsumer(); 


app.listen(PORT,()=>{
    console.log("mail service is running at port 8800")
})   