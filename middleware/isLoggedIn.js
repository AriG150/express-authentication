module.exports = function(req, res, next) {
  //detection to test if there is (or isn't) a user 
  if (!req.user) {
    req.flash('error', 'You must be logged in to view that page');
    res.redirect('/auth/login');
  } else {
    next();
  }
}