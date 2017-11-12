var express = require('express');
var router = express.Router();
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");
var bodyParser = require('body-parser');


router.use(function (req, res, next) {
    res.locals.currentUser = theUser.getUser();
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});


router.get("/:username", function (req, res, next) {
    User.findOne({
        username: req.params.username
    }, function (err, user) {
        if (err) {
            req.flash("error", "Internal Server Error");
            return res.status(500).redirect("/");
        }
        if (!user) {
            req.flash("error", "User Does not Exit");
            return res.status(404).redirect("/");
        }
        res.render("studentsDetail", {
            user: user
        });
    });
});

module.exports = router;