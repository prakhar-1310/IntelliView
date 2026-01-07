import express from "express";
import path from "path";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import {serve} from "inngest/express"

import { connectDB } from "./lib/db.js";
import {inngest,functions} from "./lib/inngest.js"
import {ENV} from "./lib/env.js";
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js";


const app = express();
const __dirname = path.resolve();

// middlewares
app.use(express.json()); // express.json() is a built-in middleware in Express.js used to parse incoming HTTP request bodies that contain JSON data.
app.use(cors({origin:ENV.CLIENT_URL,Credentials:true}));
// credentials: true means server allows a browser to include cookies on request
// CORS middleware is used to control who can access your backend APIs from a different origin (different domain, port, or protocol).
app.use("/api/inngest", serve({client:inngest, functions}))
app.use(clerkMiddleware()); // this will adds auth field to request object: req.auth()
app.use("/api/chat", chatRoutes); // For any request starting with /api/chat, hand it over to chatRoutes.
app.use("/api/sessions", sessionRoutes);

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