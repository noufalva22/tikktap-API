import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.js"
import authUsers from './routes/auth.js'
import productRoute from './routes/product.js'
import orderRoute from './routes/order.js'
import userDataRoute from './routes/userData.js'
import paymentRoute from './routes/paymentGateway.js'
import sendSMS from './routes/sendSMS.js'
import UserLog from './routes/userLog.js'
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()
dotenv.config();
const connect = async () => {

    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB");
    } catch (error) {

        throw error
    }
};
mongoose.connection.on("disconnected", () => {
    console.log("disconnected");
})
mongoose.connection.on("connected", () => {
    console.log("Connected");
})


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3000', 'https://www.naufalkareem.com'],
    credentials: true // Allow credentials (cookies)
}));
// app.use(cors())
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // replace * with the domain name(s) you want to allow
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
//middleware

app.use("/api/auth", authUsers)
app.use("/api/user", userRoute);
app.use("/api/userData", userDataRoute)
app.use("/api/products", productRoute)
app.use("/api/order", orderRoute)
app.use("/api/paynow", paymentRoute)
app.use("/api/sendSMS", sendSMS)
app.use("/api/userLog", UserLog)

app.get('/', (req, res) => {
    res.send("Welcome Backend")
})

app.listen(process.env.PORT || 5000, () => {
    connect()
    console.log("Server is running");
})