// Import the Movie Model to interact with our database
const Movie = require('../models/Movie')
const User = require('../models/User')
const axios = require('axios')

module.exports = {
    fetchMoviesList,
    fetchMovieDetail,
    addMovieToFavorites,
    getFavoriteMoviesList,
    removeMovieFromFavorites
}

function removeMovieFromFavorites(req, res) {

    // Remove movie from User's favoriteMoviesList array
    // Store the req params in a variable
    const movieID = req.params.mongoID
    if (req.user !== undefined) {
        // Grab the user
        const user = req.user
        // Find index of the movie in references array
        const indexOfMovie = user.favoriteMoviesList.indexOf(movieID)
        user.favoriteMoviesList.splice(indexOfMovie, 1)
        user.save().then(err => {
            res.redirect('/favoriteMovieList')
        })
    } else {
        console.log("You need to log in to delete a movie")
        res.redirect("/auth/google")
    }

    // The code below will delete a movie from the movie table
    // // Store the mongoID of the movie into a variable
    // const mongoID = req.params.mongoID
    // // Remove movie from our favorites (database)
    // Movie.findByIdAndDelete(mongoID).then(dbResponse => {
    //     // Redirect to favoriteMoviesList
    //     res.redirect('/favoriteMovieList')
    // })
}


async function getFavoriteMoviesList(req, res) {
    // Show favorites page if user is logged in
    if (req.user !== undefined) {
        // Grab the user from the DB or use req.user
        // populate the referenced data
        // the populate method below will transform the id's in the favMoviesList property into their corresponding mongoDB objects
        let user = await User.findById(req.user._id).populate('favoriteMoviesList')
        console.log('full populated user', user)
        res.render('favoriteMoviesList.ejs', {moviesList: user.favoriteMoviesList})
    } else {
        // Else the user is not logged in
        console.log("you need to log in to see your favorites list")
        res.redirect("/auth/google")
    }
    // OLD CODE BELOW
    // // Fetch all the movies in our favorites list (database)
    // Movie.find({}).then(favoriteMoviesList => {
    //     // Render the favoriteMoviesList.ejs file and pass to it the data from the database
    //     res.render('favoriteMoviesList.ejs',
    //         { moviesList: favoriteMoviesList })
    // })


}

function addMovieToFavorites(req, res) {
    // Store the imdbID of the movie from the req.params variable
    const imdbID = req.params.imdbID
    const APIKey = '9fc11b9b'
    const omdbAPIUrl = `http://www.omdbapi.com/?apikey=${APIKey}&i=${imdbID}`
    // Use the imdbID to make an API call and retrieve the details of that specific movie
    axios.get(omdbAPIUrl).then(response => response.data)
        .then(movieDetail => {
            // Create the movie object that we want in our favorites list
            const movieObj = {
                Title: movieDetail.Title,
                Year: movieDetail.Year,
                Genre: movieDetail.Genre,
                Actors: movieDetail.Actors,
                Plot: movieDetail.Plot,
                Poster: movieDetail.Poster
            }
            // Save the movie object to our database
            Movie.create(movieObj).then((mov) => {
                console.log('Movie added to Favorites!')
                // In the scope of this function, we have access to the 'mov' variable which is the movie object returned from the Movie.create() call above
                if (req.user !== undefined) {
                    // Grab the logged in user and store the mov id into the user document
                    const user = req.user
                    // Push the movie ID that we want to add to the user favorite list into the favoriteMoviesList property
                    user.favoriteMoviesList.push(mov._id)
                    // Save our changes
                    user.save().then(doc => console.log("Movie saved to favorites!"))
                } else {
                    console.log("You need to log in to save a movie to your favorites!")
                }
            })
            // redirect to favoriteMovieList
                .then(() => res.redirect('/favoriteMovieList'))
            // A redirect is a new GET request
    })
}







function fetchMovieDetail(req, res) {
    // Store the imdbID of the movie from the req.params in a variable
    const imdbID = req.params.imdbID
    const APIKey = '9fc11b9b'
    const omdbAPIUrl = `http://www.omdbapi.com/?apikey=${APIKey}&i=${imdbID}`
    // Use the imdbID to make an API call and retrieve the details of that specific movie
    axios.get(omdbAPIUrl).then(response => response.data)
        .then(movie => {
            // console.log("API Movie Detail Data !!!")
            // console.log(movie)
            // Pass the details of that movie to movieDetail.ejs and display it
            res.render('movieDetail.ejs', {movie: movie})
    })
}

// Exercise
function movieDetailHelper(imdbID) {
    // Fetches movie detail from API
    // Returns movei detail data
}


function fetchMoviesList(req, res) {
    // My OMDb API Key: 9fc11b9b
    // https://www.omdbapi.com/?apikey=9fc11b9b&s=dogs&page=2
    // Store the request query (a.k.a. Form Search Data a.k.a movieQuery) in a variable
    const movieQuery = req.query.movieQuery
    // Make an API call to the movie Database with our user's movieQuery
        // We can either use fetch() or axios() to make the API call
    axios.get(`https://www.omdbapi.com/?apikey=9fc11b9b&s=${movieQuery}`)
        .then(APIResponse => APIResponse.data) // Axios feature -> grab the data property
        .then(moviesList => {
            // Render the moviesList.ejs and pass to it the API data (a.k.a list of movie data)

            // console.log(moviesList)
            res.render('moviesList.ejs', {moviesList: moviesList.Search})

        })
    // Store the API data into a variable -> We will need this for when the API returns a huge amount of data
        // We need the Title, Year, Poster

    // Please display a list of all the movies with the following information:
        // Title
        // Year
        // The Poster Image
}




