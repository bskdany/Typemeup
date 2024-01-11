import { NextFunction, Request, Response } from "express";
const cookie = require("cookie")
const jwt = require('jsonwebtoken');
require('dotenv').config();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

function verifyToken(req :AuthenticatedRequest, res :Response, next :NextFunction) {
    // getting the token from the cookie 
    const toParse = req.headers["cookie"];
    if(!toParse){
        return res.status(401).json({error: "No cookie provided"})
    }
    const cookies = cookie.parse(req.headers["cookie"]);
    const token = cookies["jwt_token"]
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;