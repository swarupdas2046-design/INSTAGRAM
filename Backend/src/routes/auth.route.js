import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { getMeController, UserLogin, UserRegister } from '../controllers/auth.controller.js'

/**
 * api's: [
 *      http://localhost:3000/api/auth/register
 *      http://localhost:3000/api/auth/login
 * ]
 */

const authRouter = express.Router()

/**
 * @route POST /api/auth/register
 * @access Public
 * @description register a new user
 */

authRouter.post("/register",UserRegister)

/**
 * @route POST /api/auth/login
 * @access Public
 * @description login a user
 */
authRouter.post("/login",UserLogin)

/**
 * @route GET /api/auth/get-me
 * @access authenticated user only
 * @description get user details
 */

authRouter.get("/get-me",authMiddleware,getMeController)



export default authRouter