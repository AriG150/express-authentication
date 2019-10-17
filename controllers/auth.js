const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const db = require('../models');

//show signup form
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res){
  // Find or create the user 
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(function([user, created]) {
    if ( created) {
      // we created it, redirect to home 
        console.log(`🍕 User successfully created`);
        passport.authenticate('local', {
          successRedirect: '/',
          successFlash: 'Account created and logged in!'
        }) (req, res);
    } else {
      //If user existed, error and reidrect to signup
      // 'Email already exists' message is NOT to be included in live site (okay for production)
        req.flash('error', 'Email already exists')
        console.log(`🍥 Email already exists`);
        res.redirect('/auth/signup');
    }
  }).catch(function(err) {
    //catch any errors
      console.log(`🚨 ${err}`);
      res.redirect('/auth/signup');
  });
});


router.get('/login', function(req, res) {
  res.render('auth/login');
});


//POST form for login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'You have logged in!',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password'
}));

//Logout 
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
