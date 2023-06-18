import express from "express"
import jwt from "jsonwebtoken"
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;
    console.log("token is ", token);
    console.log("Cookie is ", req.cookies);
    if (!token) {

        return res.status(401).json("You're not authenticated!")
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return res.status(401).json("Token is not valid!")
        req.user = user;
        console.log("user is",user);

        next();
    });
}

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log("req.user is", req.user.id);
        console.log("Params id", req.params.id);
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
}
export const verifyTokenAndAdmin = (req, res, next) => {
    console.log("1", req.body);
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
}