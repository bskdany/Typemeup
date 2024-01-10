const express = require("express")
const authRoutes = require("./routes/auth")

const app = express();
app.use(express.json())
const port = 3000;

app.use(authRoutes)


app.listen(port, ()=>{
    console.log(`Listening at port ${port}`)
})
