const mongoose = require("mongoose");

const mongoDbUrl = "mongodb+srv://ajmalfarisme:5uyL5fC4hKXmXPN2@cluster0.n2uuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb = () => {
    return mongoose.connect(mongoDbUrl);
}

module.exports = { connectDb };