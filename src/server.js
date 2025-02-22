const { app } = require(".");
const { connectDb } = require("./config/db");

const PORT= 4647;
app.listen(PORT, ()=>{
    console.log("Hanger E-commerce api listing on port : ",PORT)
})