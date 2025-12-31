import express from "express";
import {ENV} from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

app.get("/msg", (req,res)=>{
    res.status(200).json({
        msg: "success from API123",
        msg2 : "API"
    })
})

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))  // making dist as static assets

    app.get("/{*any}", (req,res)=>{
        res.sendFile( path.join(__dirname,"../frontend/dist/index.html"));
    })
}

const startServer = async () =>{
    try{
        await connectDB();
        app.listen(ENV.PORT, ()=>{
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    }
    catch(error){
        console.log("error starting the server", error);
    }
}

startServer();
