var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var SALT_FACTOR = 10;
var userSchema = mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true },
createdAt: { type: Date, default: Date.now },
department:{type:String},
email:{type:String},
level:{type:String},
gender:{type:String},
sportClub:{type:String},
displayname:{type:String}
});
var noop = function() {};
userSchema.pre("save", function(done) {
var user = this;
if (!user.isModified("password")) {
return done();
}
bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
if (err) { return done(err); }
bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
if (err) { return done(err); }
user.password = hashedPassword;
done();
});
});
});

userSchema.methods.checkPassword = function(guess, done) {
bcrypt.compare(guess, this.password, function(err, isMatch) {
done(err, isMatch);
});
};
userSchema.methods.name = function() {
return this.displayName || this.username;
};
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);
module.exports = User;