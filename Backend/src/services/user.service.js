import { userModel } from "../models/user.model.js"
import ApiError from "../utils/apiError.js"
import { generateToken } from "../utils/token.js"

/**
 *     @desc    Register a new user
 *     @route   POST api/auth/register
 *     @access  Public
 *     @params  email,password,username,bio,profileImage
 *     @returns {NewUser,JWT_Token}
 *  
 */
export const registerService = async ({email,password,username,bio,profileImage})=>{
    
        if (!email||!password||!username) throw new ApiError((!email ? "Email is required" : (!password ? "Password is required" : "Username is required")),400)

        if (password.length<6 || username.length<3) throw new ApiError((password.length<6 ? "Password must be at least 6 characters" : "Username must be at least 3 characters"),400)
        
        const isExistedUser = await userModel.findOne({
            $or:[
                {email},
                {username}
            ]
        })

        if (isExistedUser) throw new ApiError((isExistedUser.email == email ? "Email already exists" : "Username already exists"),409)

        // const HasPass = await bcrypt.hash(password,10)


        const NewUser = await userModel.create({
            email,
            password,
            username,
            bio,
            profileImage
        })

        const JWT_Token = generateToken(NewUser._id,NewUser.username)

        return{
            NewUser,
            JWT_Token
        }
}

/**
 * 
 *     @desc    Login a user
 *     @route   POST api/auth/login
 *     @access  Public
 *     @params  email,password,username
 *     @returns {isExistedUser,jwt_token}
 */

export const loginService = async ({email,password,username})=>{

        console.log("email:--->",email);
        

        if (!password) throw new ApiError("Password is required",400)

            if (password.length<6) throw new ApiError("Password must be at least 6 characters",400)

        const isExistedUser = await userModel.findOne({
            $or:[
                {username:username},
                {email:email}
            ]
        }).select("+password")

        if (!isExistedUser) throw new ApiError("User not found",404)

        // const DecodePassword = await bcrypt.compare(password,isExistedUser.password)
        const DecodePassword = isExistedUser.comparePassword(password)

        if (!DecodePassword) throw new ApiError("Invalid Password",401)

        const jwt_token = generateToken(isExistedUser._id,isExistedUser.username)

        return{
            jwt_token,
            isExistedUser
        }
}

