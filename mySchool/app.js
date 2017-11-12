var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var User = require("./models/user");
var passport = require("passport"),
LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var flash = require("connect-flash");

var index = require("./routes/index");
var signUp = require("./routes/signup");
var login = require("./routes/login");
var logout = require("./routes/logout");
var deleteStudent = require("./routes/deleteStudent");
var addStudent = require("./routes/addStudent");
var studentsDetail = require("./routes/studentsDetail");
var edit = require("./routes/edit");
var searchUser = require("./routes/search");
// var routes = require("./routes/routes");

var app = express();

// var url = "mongodb://localhost:27017/test";

var url = "mongodb://alcadmin:alcadmin@ds243055.mlab.com:43055/alc";
mongoose.connect(url);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "A serious Problem has occured"));
db.once("open", function () {
    console.log("Your connection has been established");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());
app.use("/",index);
app.use("/signup",signUp);
app.use("/editStudent",edit);
app.use("/deleteStudent",deleteStudent);
app.use("/addStudent",addStudent);
app.use("/users",studentsDetail);
app.use("/search",searchUser);
app.use("/login",login);
app.use("/logout",logout);


// app.use(routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
