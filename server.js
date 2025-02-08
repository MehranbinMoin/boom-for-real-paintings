const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./Models/user");

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);

})

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/error', (req, res) => {
    res.render('error.ejs');
})

app.get('/auth/register', (req, res) => {
    res.render('auth/sign-up.ejs');
})

app.get('/auth/signin', (req, res) => {
    res.render('auth/sign-in.ejs');
})

app.post('/auth/register', async (req, res) => {
    const username = req.body.username;
    const existingArtist = await User.findOne({ username });
    if (existingArtist) {
        return res.redirect('/error')
    }

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        return res.redirect('/error')
    }

    await User.create({ username, password });
})

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}.`);

})