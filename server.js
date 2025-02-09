const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./Models/user");


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index.ejs', {user});
});

app.get('/error', (req, res) => {
    res.render('error.ejs');
});

const authController = require('./controllers/auth');
app.use('/auth', authController);

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}.`);
});