var express = require('express');
var router = express.Router();
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");
var bodyParser = require('body-parser');




function ensureAuthenticated(req, res, next) {
    if (theUser.getUser !== null) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

router.get("/:username", ensureAuthenticated, function (req, res, next) {
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
        res.render("deleteStudent", {
            user: user
        });
    });
});


router.post("/:id", ensureAuthenticated, function (req, res, next) {
    console.log("This is the body", req.body);
    console.log("This is the Params", req.params);
    User.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) {
            req.flash("error", "Internal Server Error");
            return res.status(500).redirect("/");
        }

        req.flash("error", "Student has been Deleted");
        return res.status(200).redirect("/");
    });
});


module.exports = router;