import express from 'express'

import { UserLogin, UserRegister } from '../controllers/auth.controller.js'

/**
 * api's: [
 *      http://localhost:3000/api/auth/register
 *      http://localhost:3000/api/auth/login
 * ]
 */

const authRouter = express.Router()



authRouter.post("/register",UserRegister)

authRouter.post("/login",UserLogin)

export default authRouter