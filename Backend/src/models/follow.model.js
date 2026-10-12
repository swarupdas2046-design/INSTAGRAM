import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    follower:{
        type:String,
    },
    followee:{
        type:String,
    },
    // Instagram par public profiles ke liye follow instant 'accepted' hota hai
    status:{
        type:String,
        default:"accepted",
        enum: ["pending","accepted"],
    }
},{
    timestamps:true
})

followSchema.index({follower:1,followee:1},{unique:true})

const followModel = mongoose.model("Follow",followSchema)

export default followModel