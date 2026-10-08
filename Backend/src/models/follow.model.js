import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    follower:{
        type:String,
    },
    followee:{
        type:String,
    },
    status:{
        type:String,
        default:"pending",
        enum: ["pending","accepted"],
            // message:"Status must be either 'pending' or 'accepted'"
        
    }
},{
    timestamps:true
})

followSchema.index({follower:1,followee:1},{unique:true})

const followModel = mongoose.model("Follow",followSchema)

export default followModel