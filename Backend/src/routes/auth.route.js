import express from 'express'
import { userModel } from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const authRouter = express.Router()


authRouter.post("/register",async(req,res)=>{
    try {
        const {email,password,username,bio,profileImage} = req.body

        if (!email||!password||!username) {
            return res.status(400).json({
                message:(!email ? "Email is required" : (!password ? "Password is required" : "Username is required"))
            })
        }

        if (password.length<6 || username.length<3) {
            return res.status(400).json({
                message:(password.length<6 ? "Password must be at least 6 characters" : "Username must be at least 3 characters")
            })
        }
        
        const isExistedUser = await userModel.findOne({
            $or:[
                {email},
                {username}
            ]
        })

        if (isExistedUser) {
            return res.status(409).json({
                message:(isExistedUser.email == email ? "Email already exists" : "Username already exists")
            })
        }

        const HasPass = await bcrypt.hash(password,10)


        const NewUser = await userModel.create({
            email,
            password:HasPass,
            username,
            bio,
            profileImage
        })

        const JWT_Token = jwt.sign({id:NewUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"1D",
        })

        res.cookie("jwt_token",JWT_Token,{
            httpOnly:true,
        })

        return res.status(201).json({
            message:"User created Successfully",
            User:{
                email:NewUser.email,
                username:NewUser.username,
                bio:NewUser.bio,
                profileImage:NewUser.profileImage
            }
        })


    } catch (error) {
        return res.status(500).json({
            message:"Internal server Error",
            error:error.message
        })
    }
})

authRouter.post("/login",async(req,res)=>{
    try {
        
        const {email,password,username} = req.body

        if (password.length<6) {
            return res.status(400).json({
                message:"Password must be at least 6 characters"
            })
        }

        const isExistedUser = await userModel.findOne({
            $or:[
                {username:username},
                {email:email}
            ]
        })

        if (!isExistedUser) {
            return res.status(404).json({
                message:(isExistedUser.email == email ? "Email not found" : "Username not found")
            })
        }

        const DecodePassword = await bcrypt.compare(password,isExistedUser.password)

        if (!DecodePassword) {
            return res.status(401).json({
                message:"Invalid Password"
            })
        }

        const jwt_token = jwt.sign({id:isExistedUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"1D"
        })

        res.cookie("jwt_token",jwt_token,{
            httpOnly:true,
        })

        return res.status(200).json({
            message:"Login Successfully",
            User:{
                email:isExistedUser.email,
                username:isExistedUser.username,
                bio:isExistedUser.bio,
                profileImage:isExistedUser.profileImage
            }
        })
    
    
    } catch (error) {
        return res.status(500).json({
            message:"Internal server Error",
            error:error.message,
        })
    }
})

export default authRouter