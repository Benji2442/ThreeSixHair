const express = require('express');
const passport = require('passport');
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

//===============================================
// LOGIN ROUTES
//===============================================

// RENDER SIGN UP FORM FOR ONE TIME ONLY
router.get('/register', isLoggedIn, function (req, res) {
  res.render('./admin/register');
});

// HANDLING USER SIGN UP
router.post('/register', function (req, res) {
  User.register(new User({ username: req.body.user.username }), req.body.user.password,
  function (err, user) {
    if (err) {
      console.log(err);
      return res.render('/register');
    }else {
      passport.authenticate('local')(req, res, function () {
              res.redirect('/admin');
            });
    }
  });
});

// RENDER LOGIN FORM
router.get('/login', function (req, res) {
  res.render('./admin/login');
});

//  HANDLE LOGIN REQUEST
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
  }), function (req, res) {
});

// LOGOUT button
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
