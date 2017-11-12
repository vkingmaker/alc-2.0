var express = require("express");
var router = express.Router();
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");
var passport = require("passport"),
LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');

router.use(function (req, res, next) {
    res.locals.currentUser = theUser.getUser();
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

// Sign Up
// router.get("/signup", function (req, res) {
router.get("/", function (req, res) {
    res.render("signup");
});

router.post("/", function (req, res) {
    User.register(new User({
            username: req.body.username,
            password: req.body.password,
            department: req.body.department,
            email: req.body.email,
            level: req.body.level,
            gender: req.body.gender,
            sportClub: req.body.sportClub
        }),
        req.body.password,
        function (err, user) {

            if (err) {

                User.findOne({
                    username: req.body.username
                }, function (err, user) {
                    if (err) {
                        req.flash("error", "Internal Server Error");
                        return res.status(500).redirect("/");
                    }
                    if (user) {
                        req.flash("error", "User already exists");
                        return res.redirect("/signup");
                    }
                });
            }


            passport.authenticate('local')(req, res, function () {
                console.log(user);
                theUser.setUser(user);
                return res.status(200).redirect("/");
            });

        });
});

   module.exports = router;
