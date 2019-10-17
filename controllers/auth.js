const express = require('express');
const router = express.Router();
const passport = requires('../config/ppConfig');
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
        res.redirect('/')
    } else {
      //If user existed, error and reidrect to signup 
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
router.post('/login', passport.authenticat('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));


module.exports = router;
