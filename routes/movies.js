var express = require('express');
var router = express.Router();
// Import the Movies Controller
const movieController = require('../controllers/movies.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('searchPage.ejs');
});

{/* <form action="/movieSearch" method="GET"></form> */}

router.get('/movieSearch', movieController.fetchMoviesList)

{/* <a href="/movie/<%= m.imdbID %>"><button>See Movie Details</button></a><br/> */ }

router.get('/movie/:imdbID', movieController.fetchMovieDetail)

{/* <form action="/movie/<%= movie.imdbID %>" method="POST"> */}

router.post('/movie/:imdbID', movieController.addMovieToFavorites)

// GET /favoriteMoviesList
router.get('/favoriteMovieList', movieController.getFavoriteMoviesList)

{/* <form action="/movie/<%= m._id %>" method="DELETE"> */ }

router.delete('/movie/:mongoID', movieController.removeMovieFromFavorites)

module.exports = router;
