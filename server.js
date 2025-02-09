const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const methodOverride = require("method-override");
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

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('user/home.ejs', {user});
});

app.get('/users/:id/pieces/new', async (req, res) => {
    const userId = req. params.id;
    res.render('piece/new.ejs', {userId});
});

app.get('/users/:id/pieces/:pieceId', async (req, res) => {
    const userId = req.params.id;
    const pieceId = req.params.pieceId;
    const user = await User.findById(userId);
    const piece = user.painting.id(pieceId);
    res.render('piece/show.ejs', {piece, userId});
})

app.get('/users/:id/pieces/:pieceId/edit', async (req, res) => {
    const userId = req.params.id;
    const pieceId = req.params.pieceId;
    const user = await User.findById(userId);
    const piece = user.painting.id(pieceId);
    res.render('piece/edit.ejs', {piece, userId})

});
app.post('/users/:id/pieces', async (req, res) => {
    const userId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;

    const user = await User.findById(userId);
    user.painting.push({title, description, price});
    await user.save();
    res.redirect(`/users/${userId}`); 
});

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}.`);
});