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

app.get('/auth/register', (req, res) => {
    res.render('auth/sign-up.ejs');
});

app.get('/auth/signin', (req, res) => {
    res.render('auth/sign-in.ejs');
});

app.post('/auth/register', async (req, res) => {
    try {
        const username = req.body.username;
        const existingArtist = await User.findOne({ username });
        if (existingArtist) {
            return res.send('Username is taken')
        }

        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password !== confirmPassword) {
            return res.send('Passwords not a match!')
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        await User.create({ username, password: hashedPassword });
        res.redirect('/auth/signin');
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
});

app.post('/auth/signin', async (req, res) => {
    try {
        const username = req.body.username;
        const existingArtist = await User.findOne({ username });
        if (!existingArtist) {
            return res.send('Username or password is incorrect')
        }
        const password = req.body.password;
        const isPasswordCorrect = await bcrypt.compare(password, existingArtist.password);
        if (!isPasswordCorrect) {
            return res.send('Username or password is incorrect')
        }
        req.session.user = {
            username: existingArtist.username,
            id: existingArtist._id,
        }
        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}.`);

})