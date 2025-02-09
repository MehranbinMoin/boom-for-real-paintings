const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Models/user");

router.get('/register', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.get('/signin', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.post('/register', async (req, res) => {
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

router.post('/signin', async (req, res) => {
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

module.exports = router;