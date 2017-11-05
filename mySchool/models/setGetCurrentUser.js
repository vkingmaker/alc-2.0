var currentUser;
var alert = false;

module.exports.setUser = function(user){
currentUser = user;
}

module.exports.getUser = function(){
    return currentUser;
}

module.exports.showAlert = function(){
    return alert;
}
// module.exports.dontShowAlert = function(){
//     return alert;
// }