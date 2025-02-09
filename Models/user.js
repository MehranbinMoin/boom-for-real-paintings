const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    }  
})

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    painting: [paintingSchema],
})

const User = mongoose.model('User', userSchema);

module.exports = User;