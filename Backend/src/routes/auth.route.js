import express from 'express'

import { UserLogin, UserRegister } from '../controllers/auth.controller.js'


const authRouter = express.Router()


authRouter.post("/register",UserRegister)

authRouter.post("/login",UserLogin)

export default authRouter