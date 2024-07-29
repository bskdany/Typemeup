import { db } from "./db.js";


const username = db.prepare("SELECT * FROM user WHERE id = ?")