import express from 'express'
import { followUserController, unfollowUserController } from '../controllers/follow.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const followRouter = express.Router()


followRouter.post("/follow/:username",authMiddleware,followUserController)

followRouter.post("/unfollow/:username",authMiddleware,unfollowUserController)

export default followRouter