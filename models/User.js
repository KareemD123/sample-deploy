
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: String,
    photo: String,
    googleId: String,
    // I want to reference the Movie model below
    favoriteMoviesList: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
    ]
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User