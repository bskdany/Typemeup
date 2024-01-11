import express, { Request, Response } from "express";
const router = express.Router();
const verifyToken = require('../authMiddleware');
import * as db from '../db/database';


interface AuthenticatedRequest extends Request {
    userId?: string;
}

router.get('/', verifyToken, async (req :AuthenticatedRequest, res :Response) => {
    const userId = req.userId;
    if(userId){
        const response = await db.query("SELECT username FROM users WHERE id = $1",[userId]);
        const username = response.rows[0].username;
        res.status(200).json({success: true, message: `Welcome back ${username}` });
    }
    else{
        res.status(500).send("Internal server error")
    }
});

module.exports = router;