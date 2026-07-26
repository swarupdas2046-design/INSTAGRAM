import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imageUrl:{
        type:String,
        required:[true,"Image is required for creating a post"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"UserInfos",
        required:[true,"User id is required for creating a post"]
    }
},{
    timestamps:true
}) 

export const postModel = mongoose.model("userPosts",postModel)

