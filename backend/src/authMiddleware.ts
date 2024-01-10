import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
require('dotenv').config();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

function verifyToken(req :AuthenticatedRequest, res :Response, next :NextFunction) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;