// Import mongoose library
const mongoose = require('mongoose')

// Create our Movie Schema
const MovieModel = mongoose.Schema({
    Title: {type: String, required: true},
    Year: {type: String, required: true},
    Genre: {type: String, required: true},
    Actors: {type: String, required: true},
    Plot: {type: String, required: true},
    Poster: {type: String, required: true}
})
const Movie = mongoose.model('Movie', MovieModel)

module.exports = Movie





