import express from "express";
import {ENV} from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import {inngest} from "./lib/inngest.js"
import {serve} from "inngest/express"

const app = express();

const __dirname = path.resolve();

// middlewares
app.use(express.json()); // express.json() is a built-in middleware in Express.js used to parse incoming HTTP request bodies that contain JSON data.
app.use(cors({origin:ENV.CLIENT_URL,Credentials:true}));
// credentials: true means server allows a browser to include cookies on request
// CORS middleware is used to control who can access your backend APIs from a different origin (different domain, port, or protocol).
app.use("/api/inngest", serve({client:inngest, functions}))

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
