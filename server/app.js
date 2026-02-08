import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();

const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:5173'];

app.use(cors({                         
    origin: allowedOrigins,            
    credentials: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true,limit:
    "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

 

import userRouter from "./routes/user.routes.js";
import imageRouter from "./routes/image.routes.js";

app.use("/api/v1/users", userRouter)

app.use("/api/v1/image",imageRouter)


export default app;