import dotenv from "dotenv";

dotenv.config({quiet : true}); // this will stops the warning or env count from the dontenv when we running the server

export const ENV = {
    PORT : process.env.PORT,
    DB_URL : process.env.DB_URL,
    NODE_ENV : process.env.NODE_ENV,
    INNGEST_EVENT_KEY : process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY : process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY : process.env.STREAM_API_KEY,
    STREAM_API_SECRET : process.env.STREAM_API_SECRET,
    CLIENT_URL : process.env.CLIENT_URL
}