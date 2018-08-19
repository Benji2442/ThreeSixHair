const express   = require('express');
const Treatment = require('../models/treatment.js');
const router    = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

//===============================================
// ADMIN ROUTES
//===============================================

// RENDERS ADMIN DASHBOARD
router.get('/admin', isLoggedIn, function (req, res) {
  res.render('./admin/admin');
});

// RENDERS TABLE OF ALL TREATMENTS
router.get('/treatments', isLoggedIn, function (req, res) {
  Treatment.find({}, function (err, treatments) {
          if (err) {
            console.log(err);
          }else {
            res.render('./admin/treatments', { treatments: treatments });
          }
        });
});

// RENDERS NEW TREATMENTS PAGE
router.get('/treatments/new', isLoggedIn, function (req, res) {
  res.render('./admin/add-treatment');
});

// CREATE ROUTE
router.post('/treatments/new', function (req, res) {
  Treatment.create(req.body.treatment, function (err, newTreatment) {
    if (err) {
      console.log(err);
      res.render('/');
    }else {
      res.redirect('/treatments');
    }
  });
});

// EDIT ROUTE
router.get('/treatments/:id/edit', isLoggedIn, function (req, res) {
  Treatment.findById(req.params.id, function (err, foundTreatment) {
    if (err) {
      res.redirect('./admin/treatments');
    } else {
      res.render('./admin/edit-treatment', { treatment: foundTreatment });
    }
  });
});

// UPDATE ROUTES
router.put('/treatments/:id', function (req, res) {
  Treatment.findByIdAndUpdate(req.params.id, req.body.treatment, function (err, updatedTreatment) {
    if (err) {
      console.log(err);
    }else {
      res.redirect('/treatments');
    }
  });
});

// DELETE ROUTES
router.delete('/treatments/:id', function (req, res) {
  Treatment.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/treatments');
    } else {
      res.redirect('/treatments');
    }
  });
});

module.exports = router;
