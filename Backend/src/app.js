import express from 'express'
import cookie from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'

const app = express()
app.use(express.json())
app.use(cookie())

// auth routes 
app.use("/api/auth",authRouter)

// post routes
app.use("/api/post",postRouter)

export default app