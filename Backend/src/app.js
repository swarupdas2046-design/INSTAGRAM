import express from 'express'
import cookie from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
import errorMiddleware from './middlewares/error.middleware.js'
import followRouter from './routes/follow.route.js'
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
    credentials:true,
    origin:"http://localhost:5173"
}))

app.use(express.urlencoded({extended:true}))

console.log("Mounting auth routes...")
// auth routes 
app.use("/api/auth",authRouter)

// post routes
app.use("/api/post",postRouter)

app.use("/api/user",followRouter)






app.use(errorMiddleware)

export default app