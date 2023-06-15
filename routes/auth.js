import express from "express"
import User from "../models/User.js"
const router = express.Router();
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import crypto from 'crypto'


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
        subject: 'One-Time Password (OTP) for Login – tikktap',
        html: `<p>Dear User,</p>
        <p>You are receiving this email because you have requested a one-time password (OTP) to log in to your Tikktap account. Please use the OTP provided below to access your account:</p>
        <p style="font-size: 24px;">OTP: ${otp}</p>
        <p>If you did not initiate this request or no longer wish to log in, you can safely ignore this email. The OTP is valid for a limited time only.</p>
        <p>Please note that for security purposes, the OTP should be kept confidential and not shared with anyone. It is a one-time code and will expire after a certain period of time.</p>
        <p>Thank you for using Tikktap.</p>
        <p>Best regards,</p>
        <p>Tikktap Support Team</p>`
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

//Password reset link generate and send email


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        //sending mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noufalva91@gmail.com',
                pass: 'hunoxkwlpftzpedg'
            }
        });

        const mailOptions = {
            from: 'noufalva91@gmail.com',
            to: email,
            subject: 'Forgot Password Token',
            html: `<p>Dear User,</p>
<p>We have received a request to reset your password for your Tikktap account. To proceed with the password reset process, please click the link below:</p>
<p><a href="http://localhost:3000/reset-password/${token}">Click here</a></p>
<p>If you did not initiate this request or no longer wish to reset your password, you can safely ignore this email. Your existing password will remain unchanged.</p>
<p>Please note that this link will expire after 1 hour, so make sure to reset your password promptly.</p>
<p>Thank you for using Tikktap.</p>
<p>Best regards,</p>
<p>The Tikktap Team</p>`
        };

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

        res.json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

//validating token

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Set the new password and clear the token and expiration
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router