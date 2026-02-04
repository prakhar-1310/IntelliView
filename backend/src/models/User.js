import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required : true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        profileImage:{
            type:String,
            default:"",
        },
        clerkId:{
            type:String,
            required:true,
            unique:true,
        },
        codefolioUsernames:{
            leetcode: { type: String, default: "" },
            codeforces: { type: String, default: "" },
            codechef: { type: String, default: "" },
            location: { type: String, default: "" },
            university: { type: String, default: "" },
            about: { type: String, default: "" }
        }
    },
    {timestamps : true} // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;