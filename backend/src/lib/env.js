import dotenv from "dotenv";

dotenv.config({quiet : true}); // this will stops the warning or env count from the dontenv when we running the server

export const ENV = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    NODE_ENV : process.env.NODE_ENV
}