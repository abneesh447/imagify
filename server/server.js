import dotenv from "dotenv";
dotenv.config();
import connectDB from './db/index.js'

import app from "./app.js";

connectDB()
.then(()=>{ 
    app.on("error",(error)=>{
        console.log(`ERROR: ${error}`);
        throw error;
    })
    app.listen(process.env.PORT || 4000,()=>{
    console.log("MONGODB connection successful and listening at port: ",`${process.env.PORT}`);
})
})
.catch((error)=>{
    console.log("MONGO db connection failed !!! ", error);
})