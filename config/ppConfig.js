const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

//used whenever tries to put user into session. Only putting user.id into session in order to retrieve
//the rest of the users information from the db 
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.user.findByPk(id)
  .then(function(user) {
    cb(null, user);
  }).catch(cb);
});

//configure local strategy and tell it how to work. 
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, cb) {
  db.user.findOne({
    where: { email }
  }).then(function(user) {
    if ( !user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}));

module.exports = passport;