import express from 'express'
import cookie from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import postRouter from './routes/post.route.js'
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()
app.use(express.json())
app.use(cookie())

app.use(express.urlencoded({extended:true}))


// auth routes 
app.use("/api/auth",authRouter)

// post routes
app.use("/api/post",postRouter)






app.use(errorMiddleware)

export default app