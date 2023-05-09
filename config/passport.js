
const passport = require('passport')

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

const User = require('../models/User')

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK
        },
        function (accessToken, refreshToken, googleProfile, cb) {
            // Function Handler for Google's API response
            // Look in DB for existing user if there is one
            User.findOne({ googleId: googleProfile.id }).then(function (user, err) {
                if (err) return cb(err)
                if (user !== undefined) {
                    return cb(null, user)
                } else { // else meaning if the user IS undefined i.e. they dont exist
                    // We have a new User!
                    const newUser = new User({
                        // Make sure we match our user schema!
                        firstName: googleProfile.name.givenName,
                        lastName: googleProfile.name.familyName,
                        email: googleProfile.emails[0].value,
                        photo: googleProfile.photos[0].value,
                        googleId: googleProfile.id
                    })

                    newUser.save().then(err => {
                        if (err) return cb(err)
                        // if everything is all good then:
                        return cb(null, newUser)
                    })

                    // User.create({
                    //     // Make sure we match our user schema!
                    //     firstName: googleProfile.name.givenName,
                    //     lastName: googleProfile.name.familyName,
                    //     email: googleProfile.emails[0].value,
                    //     photo: googleProfile.photos[0].value,
                    //     googleId: googleProfile.id
                    // }).then(function (newUser, err) {
                    //     if (err) return cb(err)
                    //     // if everything is all good then:
                    //     return cb(null, newUser)
                    // })


                }
            })
        }
    )
)



passport.serializeUser(function (user, done) {
    // We add the ID of the user to the session
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    // We grab the ID of the user from the session
    User.findById(id).then(function (user, err) {
        // This is where we attach the user from mongoDB to req.user
        // req.user = user object from MongoDB
        done(err, user)
    })
})




