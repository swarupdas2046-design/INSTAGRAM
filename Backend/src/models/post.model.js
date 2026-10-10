import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imageUrl:[
        {
            url:{
                type:String,
                required:[true,"Image URL is required for creating a post"]
            },

            fileId:{
                type:String,
                required:[true,"Field id is required for creating a post"]
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserInfo",
        required:[true,"User id is required for creating a post"]
    }
},{
    timestamps:true
}) 

export const postModel = mongoose.model("userPosts",postSchema)

