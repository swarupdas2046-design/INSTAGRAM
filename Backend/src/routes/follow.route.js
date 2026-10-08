import express from 'express'
import { followUserController, unfollowUserController } from '../controllers/follow.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

/**
 * api's: [
 *      http://localhost:3000/api/user/follow/:username
 *      http://localhost:3000/api/user/unfollow/:username
 * ]
 * access -> Only Authenticated Users
 */

const followRouter = express.Router()

/**
 * @route POST /api/user/follow/:username
 * @access authenticated user only
 * @description follow the user with the given username
 */

followRouter.post("/follow/:username",authMiddleware,followUserController)

/**
 * @route POST /api/user/unfollow/:username
 * @access authenticated user only
 * @description unfollow the user with the given username
 */
followRouter.post("/unfollow/:username",authMiddleware,unfollowUserController)

export default followRouter