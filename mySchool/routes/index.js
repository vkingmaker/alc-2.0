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

/* GET home page. */
router.get("/", function (req, res, next) {
  if (theUser.getUser()) {
      User.find()
          .sort({
              createdAt: "descending"
          })
          .exec(function (err, users) {
              if (err) {
                  return next(err);
              }

              res.render("index", {
                  users: users
              });
          });
  } else {
      req.flash("error", "You must be Logged in as an Admin");
      // res.redirect("/login");
      res.redirect("/login");
  }


});

module.exports = router;
