const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('user/home.ejs', { user });
});

router.get('/:id/pieces/new', async (req, res) => {
    const userId = req.params.id;
    res.render('piece/new.ejs', { userId });
});

router.get('/:id/pieces/:pieceId', async (req, res) => {
    const userId = req.params.id;
    const pieceId = req.params.pieceId;
    const user = await User.findById(userId);
    const piece = user.painting.id(pieceId);
    res.render('piece/show.ejs', { piece, userId });
})

router.get('/:id/pieces/:pieceId/edit', async (req, res) => {
    const userId = req.params.id;
    const pieceId = req.params.pieceId;
    const user = await User.findById(userId);
    const piece = user.painting.id(pieceId);
    res.render('piece/edit.ejs', { piece, userId })

});

router.post('/:id/pieces', upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
    }

    const user = await User.findById(userId);
    user.painting.push({ title, description, price, image });
    await user.save();
    res.redirect(`/users/${userId}`);
});

router.put('/:id/pieces/:pieceId', upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const pieceId = req.params.pieceId;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    const newPrice = req.body.price;
    const newImage = req.body.image
    const user = await User.findById(userId);
    const piece = user.painting.id(pieceId);
    piece.title = newTitle;
    piece.description = newDescription;
    piece.price = newPrice;
    piece.image = newImage;
    if (req.file) {
        piece.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    };
    await user.save();
    res.redirect(`/users/${userId}/pieces/${pieceId}`);
});

router.delete('/:id/pieces/:pieceId', async (req, res) => {
    const userId = req.params.id;
    const pieceId = req.params.pieceId;
    const user = await User.findById(userId);
    user.painting.pull({ _id: pieceId });
    await user.save();
    res.redirect(`/users/${userId}`);
});

module.exports = router;