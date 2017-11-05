var express = require("express");
var User = require("../models/user");
var theUser = require("../models/setGetCurrentUser");
var passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var assert = require("assert");
var router = express.Router();
var studentById;

//Sets local variables that will be used across the application
router.use(function (req, res, next) {
    res.locals.currentUser = theUser.getUser();
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});


router.use(bodyParser.json());


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
        res.redirect("/login");
    }


});


router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", function (req, res) {
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

router.get("/users/:username", function (req, res, next) {
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

router.get("/login", function (req, res) {
    res.render("login");
});



router.post("/login", function (req, res, next) {
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

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("info", "Thank You for Visiting Our site, have a great Day...");
    theUser.setUser(null);
    res.redirect("/");

});

function ensureAuthenticated(req, res, next) {
    if (theUser.getUser !== null) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

router.get("/editStudent/:username", function (req, res, next) {
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
        res.render("editStudent", {
            user: user
        });
    });
});






router.post("/editStudent/:username", ensureAuthenticated, function (req, res, next) {
    User.findOneAndUpdate({
        username: req.params.username
    }, {
        $set: req.body
    }, {
        new: true
    }, function (err, doc) {
        if (err) {
            req.flash("error", "Ensure you have the privilage to edit documents");
            res.redirect("/login");
        }

        theUser.setUser(doc);
        req.flash("info", "Updated successfully!");
        res.redirect("/");
    });

});

router.get("/deleteStudent/:username", ensureAuthenticated, function (req, res, next) {
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


router.post("/deleteStudent/:id", ensureAuthenticated, function (req, res, next) {
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

router.get("/addStudent", ensureAuthenticated, function (req, res, next) {
    res.render("addStudent");
});

router.post("/addStudent", ensureAuthenticated, function (req, res, next) {

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
                        return res.redirect("/addStudent");
                    }
                });
            }


            passport.authenticate('local')(req, res, function () {
                console.log(user);
                // theUser.setUser(user);
                return res.status(200).redirect("/");
            });

        });

});


module.exports = router;