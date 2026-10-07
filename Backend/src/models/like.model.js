import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userPosts",
        required:[true,"Post id is required for creating a like"]
    },
    user:{
        type:String,
        required:[true,"Username is required for creating a like"]
    }
},{
    timestamps:true
})

likeSchema.index({post:1,user:1},{unique:true})

const likeModel = mongoose.model("Like",likeSchema)

export default likeModel