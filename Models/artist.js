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
    image: {
        data: Buffer,       
        contentType: String,  
      },
    price: {
        type: Number,
        required: true,
    }  
})

const artistSchema = new mongoose.Schema ({
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

const User = mongoose.model('Artist', artistSchema);

module.exports = Artist;