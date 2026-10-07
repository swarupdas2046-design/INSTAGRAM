import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    follower:{
        type:String,
    },
    followee:{
        type:String,
    }
},{
    timestamps:true
})

followSchema.index({follower:1,followee:1},{unique:true})

const followModel = mongoose.model("Follow",followSchema)

export default followModel