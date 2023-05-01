import express from "express"
import User from "../models/User.js"
const router = express.Router();
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';

router.post("/register", async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        console.log("existing");
        return res
            .status(410)
            .json({ message: "Email address already exists in database." });
    }

    const NewUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        isAdmin: req.body.isAdmin
    })
    try {
        const savedUser = await NewUser.save()
        console.log("Check");
        res.status(201).json(savedUser)
    } catch (err) {

        res.status(500).json(err)
    }


})

router.post("/login", async (req, res, next) => {



    try {
        const user = await User.findOne(
            {
                email: req.body.email
            }
        )
        if (!user) next(createError(400, "User not found!"))
        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Wrong password or username!"));
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT,
            { expiresIn: "2d" }


        );

        const { password, isAdmin, ...otherDetails } = user._doc;
        res.cookie("access_token", accessToken, {
            httpOnly: true,
        })
            .status(200)
            .json({ ...otherDetails, isAdmin, accessToken });



    } catch (err) {
        // next(err);
    }


})
const otpMap = new Map();
router.post("/send-otp", async (req, res, next) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'noufalva91@gmail.com',
            pass: 'hunoxkwlpftzpedg'
        }
    });
    // console.log(otp, email);
    const mailOptions = {
        from: 'noufalva91@gmail.com',
        to: email,
        subject: 'OTP for login',
        text: `Your OTP is ${otp}. Please use this to login.`
    };
    otpMap.set(email, otp); // store otp for verification
    // console.log(otpMap);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.log(error);
            res.status(500).json({ message: 'Failed to send OTP' });
        } else {
            // console.log('Email sent: ' + info.response);
            otpMap.set(email, otp); // store otp for verification
            res.json({ message: 'OTP sent successfully' });
        }
    });

})
router.post("/verify-otp", async (req, res, next) => {
    const email = req.body.email;
    const otp = req.body.otp;
    // console.log(email, otp);

    if (otpMap.has(email) && otpMap.get(email) === otp) {
        // clear OTP for the user after successful verification
        otpMap.delete(email);
        res.json({ message: 'OTP verification successful' });
    } else {
        res.status(401).json({ message: 'Invalid OTP' });
    }

})


export default router