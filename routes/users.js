var express = require('express');
var router = express.Router();
const passport = require('passport')
/* GET users listing. */

// Google OAuth login route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


// Google OAuth callback route
router.get(
  '/oauth2callback',
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);


// OAuth logout route
router.get("/logout", function (req, res, next) {
  req.logout(err => err ? next(err) : null);
  res.redirect("/");
});



module.exports = router;
