import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
import * as db from '../db/database';

router.get('/get-users', async(req :Request, res: Response) => {
    try{
        const {rows} = await db.query('SELECT * FROM users')
        res.send(rows);
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
            return res.status(400).send("Username is already taken");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, password) VALUES ($1 ,$2)", [username, hashedPassword]);
        res.send("Success")

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/login', async(req :Request, res :Response) => {
    try{
        const {username, password} = req.body;
        const result = await db.query("SELECT * FROM users WHERE username = $1",[username]);
        const user = result.rows[0];
        if(user && bcrypt.compareSync(password, user.password)){    
            const token = jwt.sign({ userId: user.id },process.env.JWT_KEY);        
            res.status(200).json({token})       
        }
        else{
            res.send("Login fail")
        }
    }
    catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;