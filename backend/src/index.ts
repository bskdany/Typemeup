import express, { NextFunction, Request, Response } from 'express';
import * as db from './db/database';

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

app.post('/create-user', (req :Request, res :Response) => {
    try{
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, ()=>{
    console.log(`Listening at port ${port}`)
})
