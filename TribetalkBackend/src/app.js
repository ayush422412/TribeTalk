import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './Routes/User.route.js'
import serverRouter from './Routes/Server.route.js'
import channelRouter from './Routes/Channel.route.js'

//routes usage
app.use("/api/v1/users", userRouter)
app.use("/api/v1/server", serverRouter)
app.use("/api/v1/channels", channelRouter)

export { app};