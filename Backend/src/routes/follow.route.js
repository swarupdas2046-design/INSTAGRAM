import express from 'express'
import { acceptController, followRequestController, followUserController, rejectController, unfollowUserController } from '../controllers/follow.controller.js'
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


followRouter.get("/follow/follow-requests",authMiddleware,followRequestController)

followRouter.post("/follow/accept-request/:username",authMiddleware,acceptController)

followRouter.post("/follow/reject-request/:username",authMiddleware,rejectController)


export default followRouter