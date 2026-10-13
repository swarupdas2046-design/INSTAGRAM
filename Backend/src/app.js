import express from "express";
import cookie from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import followRouter from "./routes/follow.route.js";
import userProfileRouter from "./routes/userProfile.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.set("trust proxy", 1)

// const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
//     .split(",")
//     .map((origin) => origin.trim())
//     .filter(Boolean)

// app.use((req, res, next) => {
//     console.log("METHOD:", req.method)
//     console.log("URL:", req.originalUrl)
//     next()
// })

app.use(express.json());
app.use(cookie());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// app.use(express.static(path.join(__dirname, "..", "./Public")));

const publicPath = path.join(__dirname, "..", "public");

app.use(express.static(publicPath));

app.use(express.urlencoded({ extended: true }));

// Auth routes (login, register, get-me)
app.use("/api/auth", authRouter);

// Post routes (create, feed, explore, like, unlike, comments)
app.use("/api/post", postRouter);

// Follow & social routes (follow, unfollow, followers, following, suggested, follow-status)
app.use("/api/user", followRouter);

// User profile routes (search, get profile, update profile)
app.use("/api/user", userProfileRouter);



// Unknown API routes ke liye JSON response
app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// React Router ke frontend routes handle karne ke liye
app.get("/{*splat}", (req, res, next) => {
  res.sendFile(path.join(publicPath, "index.html"), (err) => {
    if (err) next(err);
  });
});


app.use(errorMiddleware);



export default app;
