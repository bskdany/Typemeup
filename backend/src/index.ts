import express, { NextFunction, Request, Response } from 'express';
import * as db from './db/database';
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json())
const port = 3000;

app.get('/', (req :Request, res :Response) => {
    res.send("Hello world");
})

app.get('/get-users', async(req :Request, res: Response, next :NextFunction) => {
    try{
        const {rows} = await db.query('SELECT * FROM users')
        res.send(rows);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

app.post('/register', async (req :Request, res :Response) => {

    const {username, password} = req.body;
    console.log(username, password)
    try{
        const existingUser = await db.query("SELECT * FROM users WHERE username = $1", [username])
        if(existingUser.rows.length > 0){
            return res.status(400).send("Username is already taken");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query("INSERT INTO users (username, password) VALUES ($1 ,$2)", [username, hashedPassword]);
        res.send("Success")

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`)
})
