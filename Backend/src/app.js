import express from 'express'
import cookie from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
import errorMiddleware from './middlewares/error.middleware.js'
import followRouter from './routes/follow.route.js'
import userProfileRouter from './routes/userProfile.route.js'
import cors from 'cors'

const app = express()

app.use((req, res, next) => {
    console.log("METHOD:", req.method)
    console.log("URL:", req.originalUrl)
    next()
})

app.use(express.json())
app.use(cookie())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))
app.use(express.urlencoded({ extended: true }))

// Auth routes (login, register, get-me)
app.use("/api/auth", authRouter)

// Post routes (create, feed, explore, like, unlike, comments)
app.use("/api/post", postRouter)

// Follow & social routes (follow, unfollow, followers, following, suggested, follow-status)
app.use("/api/user", followRouter)

// User profile routes (search, get profile, update profile)
app.use("/api/user", userProfileRouter)

app.use(errorMiddleware)

export default app