import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username must be unique"],
        required:[true,"Name is required"],
        trim:true,
    },
    email:{
        type:String,
        unique:[true,"Email must be unique"],
        required:[true,"Email is required"],
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true
    },

},{
    timestamps:true
})

export const userModel = mongoose.model("UserInfo",userSchema)