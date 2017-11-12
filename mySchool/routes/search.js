var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");

router.use(function (req, res, next) {
  res.locals.currentUser = theUser.getUser();
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// search student
router.get("/", function (req, res, next) {
res.render("index");
});

router.get("/:username", function (req, res, next) {
    console.log("The userName is ", req.body.username);
  if (theUser.getUser()) {

    User.findByUsername(req.params.username,function(err,student){
        if(err){
            req.flash("error","The student does not exist");
            res.redirect("/");
        }

        req.flash("info","Search succeeded");
        res.render("index",{users:users});
    });
  } else {
      req.flash("error", "You must be Logged in as an Admin");
      // res.redirect("/login");
      res.redirect("/login");
  }


});

module.exports = router;
