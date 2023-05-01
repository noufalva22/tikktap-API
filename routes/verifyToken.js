import express from "express"
import jwt from "jsonwebtoken"
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.token;
    console.log( "Token is",req.headers.token);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
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