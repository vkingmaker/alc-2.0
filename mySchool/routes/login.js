var express = require("express");
var router = express.Router();
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");
var passport = require("passport"),
LocalStrategy = require('passport-local').Strategy;

router.use(function (req, res, next) {
    res.locals.currentUser = theUser.getUser();
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

// Log in

router.get("/", function (req, res) {
    res.render("login");
});

router.post("/", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            req.flash("error", "Internal Server Error");
            return res.status(500).redirect("/");
        }
        if (!user) {
            req.flash("error", "Please check your credentials and try again: Ensure you signed up");
            return res.status(401).redirect("/login");
        }
        req.logIn(user, function (err) {
            if (err) {
                req.flash("error", "Could not login User");
                return res.status(500).redirect("/");
            }

            theUser.setUser(user);
            req.flash("info", "Logged in successfully...");


            return res.redirect("/");
        });
    })(req, res, next);
});

module.exports = router;