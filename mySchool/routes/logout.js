var express = require("express");
var router = express.Router();
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");

router.use(function (req, res, next) {
    res.locals.currentUser = theUser.getUser();
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});
// logout

router.get("/", function (req, res) {
    req.logout();
    req.flash("info", "Thank You for Visiting Our site, have a great Day...");
    theUser.setUser(null);
    res.redirect("/");

});
module.exports = router;