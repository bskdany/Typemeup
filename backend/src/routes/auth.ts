import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
const verifyToken = require('../authMiddleware');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
import * as db from '../db/database';
const { v4: uuidv4 } = require('uuid');

router.get('/auth', verifyToken, async(req :Request, res: Response) => {
    try{
        return res.status(200).json({success: true})
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

router.post('/register', async (req :Request, res :Response) => {
    try{
        const {username, password} = req.body;
        const existingUser = await db.query("SELECT * FROM users WHERE username = $1", [username])

        if(existingUser.rows.length > 0){
            return res.status(409).json({error:"Username is already taken"});
        }
        const newUuid = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (id, username, password) VALUES ($1 ,$2, $3)", [newUuid, username, hashedPassword]);
        return res.status(200).json({success:true, message:"Account registered"})

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/login', async(req :Request, res :Response) => {
    try{
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({error: "Username or password are missing"})
        }

        const result = await db.query("SELECT * FROM users WHERE username = $1",[username]);
        if(!result){
            return res.status(401).json({error: "Invalid username or password"})
        }
        const user = result.rows[0];
        if(user && bcrypt.compareSync(password, user.password)){    
            //////// important part!
            const token = jwt.sign({ userId: user.id },process.env.JWT_KEY);       

            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

            res.cookie("jwt_token", token, {httpOnly: true, sameSite: "strict", secure: true, expires: oneYearFromNow})  
            return res.status(200).json({success:true, message:"Login succesful"})       
        }
        else{
            return res.status(401).json({error: "Invalid username or password"})
        }
    }
    catch(error){
        console.error('Error loggin-in user:', error);
        res.status(500).json({error: 'Internal Server Error' });
    }
})

router.post('/logout', async(req :Request, res :Response) => {
    try{
        // const token = jwt.sign({ userId: user.id },process.env.JWT_KEY);       

        // const oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        res.cookie("jwt_token", "", {httpOnly: true, sameSite: "strict", secure: true})  
        return res.status(200).json({success:true, message:"Login succesful"})       

    }
    catch(error){
        console.error('Error loggin-in user:', error);
        res.status(500).json({error: 'Internal Server Error' });
    }
})

module.exports = router;