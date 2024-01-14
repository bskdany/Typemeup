const express = require("express")
const authRoutes = require("./routes/auth")
const restrictedRoute = require("./routes/protectedRoute");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

app.use(authRoutes);
app.use(restrictedRoute);

app.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`)
})
