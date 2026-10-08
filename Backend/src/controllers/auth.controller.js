import { loginService, registerService } from '../services/user.service.js'
import ApiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

/**
 *- User Data
 *- user ka safe data return karta hai.
 */
const userData = (user)=>{
    return{
        _id:user._id,
        email:user.email,
        username:user.username,
        bio:user.bio,
        profileImage:user.profileImage,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
    }
}

/**
 *- Register Controller
 *- api -> http://localhost:3000/api/auth/register
 *- method -> POST
 *- req.body -> email,password,username,bio,profileImage
 *- res-> {success:true,message:"User Register Successfully",data:{_id,email,username,bio,profileImage,createdAt,updatedAt}}
 *- access -> Public
 */

export const UserRegister = asyncHandler(async(req,res)=>{
    
        const {NewUser,JWT_Token} = await registerService(req.body)

        res.cookie("jwt_token",JWT_Token,{
            httpOnly:true,
        })

        return res.status(201).json(new ApiResponse("User Register Successfully",userData(NewUser)))

}
)

/**
 *- Login Controller
 *- api -> http://localhost:3000/api/auth/login
 *- method -> POST
 *- req.body -> email,password,username
 *- res-> {success:true,message:"Login Successfully",data:{_id,email,username,bio,profileImage,createdAt,updatedAt}}
 *- access -> Public
 */


export const UserLogin = asyncHandler(async(req,res)=>{
        
        const {isExistedUser,jwt_token} = await loginService(req.body)

        res.cookie("jwt_token",jwt_token,{
            httpOnly:true,
        })

        return res.status(200).json(new ApiResponse("Login Successfully",userData(isExistedUser)))
    

}
)
