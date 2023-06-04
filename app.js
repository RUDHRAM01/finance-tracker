const express = require("express")
var path = require('path');
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config();
const userRoute = require('./routes/User');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use("/", userRoute);

app.listen(8000, () => {
    console.log("app is running...");
    mongoose.connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connection to MongoDB successful');
    }).catch((err) => {
        console.log('Connection to MongoDB failed');
    });    
})