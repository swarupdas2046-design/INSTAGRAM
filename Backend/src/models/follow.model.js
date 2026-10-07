import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    follower:{
        user: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo",
        required:[true,"Follower id is required"]
    },
    followed:{
        user: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo",
        required:[true,"Followee id is required"]
    }
},{
    timestamps:true
})

const followModel = mongoose.model("Follow",followSchema)

export default followModel