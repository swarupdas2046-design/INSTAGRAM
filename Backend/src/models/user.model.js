import mongoose from "mongoose";
import bcrypt from 'bcrypt'
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
        trim:true,
        minLength:[6,"Password must be at least 6 characters"],
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"
    },

},{
    timestamps:true
})


userSchema.pre("save",function(){
    if (!this.isModified("password")) {
        return
    }
    this.password = bcrypt.hashSync(this.password,10)
})

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password)
}


export const userModel = mongoose.model("UserInfo",userSchema)