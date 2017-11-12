var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
  if (err) { return next(err); }
  if (!user) { return next(404); }
  res.render("profile", { user: user });
  });
  });

module.exports = router;
