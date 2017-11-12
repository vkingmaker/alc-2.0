var express = require("express");
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
// editStudent

function ensureAuthenticated(req, res, next) {
    if (theUser.getUser !== null) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}


router.get("/:id", function (req, res, next) {
    console.log("My Id ", req.params.id)
    User.findById({
        _id: req.params.id
        // username: req.params.username
    }, function (err, user) {
        if (err) {
            req.flash("error", "Internal Server Error");
            return res.status(500).redirect("/");
        }
        if (!user) {
            req.flash("error", "User Does not Exit");
            return res.status(404).redirect("/");
        }
        res.render("editStudent", {
            user: user
        });
    });
    });



router.post("/:id", ensureAuthenticated, function (req, res, next) {
    console.log("This is the id parameter",req.params._id);
    User.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
        // $set:{username:req.params.username,department:req.params.department,email:req.params.email,
        // level:req.params.level,sportClub:req.params.sportClub}
    }, {
        new: true
    }, function (err, doc) {
        if (err) {
            req.flash("error", "Ensure you have the privilage to edit documents");
            res.redirect("/login");
        }

        // theUser.setUser(doc);
        req.flash("info", "Updated successfully!");
        res.redirect("/");
    });

});


module.exports = router;