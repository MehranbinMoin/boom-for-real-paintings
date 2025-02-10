const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./Models/user");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const methodOverride = require("method-override");

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.post('/api/upload', upload.single('avatar'), (req, res) => {
    res.send('Uploaded successfully!');
});
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.get('/', async (req, res) => {
    const user = req.session.user;
    const users =  await User.find();
    const mergedPaintings = [];
    for (let i = 0; i < users.length; i++ ) {
    mergedPaintings.push(...users[i].painting)
    }
    res.render('index.ejs', { user, mergedPaintings});
});

app.get('/error', (req, res) => {
    res.render('error.ejs');
});

const authController = require('./controllers/auth');
app.use('/auth', authController);

const isSignedIn = require('./middleware/is-signed-in');
app.use(isSignedIn);

const userController = require('./controllers/user');
app.use('/users', userController);

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}.`);
});