const express = require("express")
const authRoutes = require("./routes/auth")
const restrictedRoute = require("./routes/protectedRoute")

const app = express();
app.use(express.json())
const PORT = 3000;

app.use(authRoutes);
app.use(restrictedRoute);

app.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`)
})
