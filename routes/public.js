const express = require('express');
const nodemailer = require('nodemailer');
const request = require('request');
const Treatment = require('../models/treatment');
const router = express.Router();

//===============================================
// FUNCTIONS & MIDDLEWARE
//===============================================

function addEmailToMailchimp(email) {
  var options = { method: 'POST',
    url: 'https://us18.api.mailchimp.com/3.0/lists/c13587663f/members',
    headers:
   { 'Postman-Token': 'c2acb848-e135-4fcf-bcf9-1c249281eba6',
      'Cache-Control': 'no-cache',
      Authorization: 'Basic YW55c3RyaW5nOmQzOTBkZTI3NmEwZjMxNzA1MGQ2ODk5MDQyNDljNWNlLXVzMTg=',
      'Content-Type': 'application/json', },
    body: { email_address: email, status: 'subscribed' },
    json: true, };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}

//===============================================
// ROUTES
//===============================================

// RENDERS LANDING PAGE
router.get('/', function (req, res) {
    res.render('./public/36hair');

    // res.send(process.env.MONGODB_PASS);
  });

// POST REQUEST FOR SENDING EMAIL TO MAILCHIMP LIST
router.post('/', function (req, res) {

  // get form info that was submitted & submit to mailchimp
  let email = req.body.mailingEmail;
  addEmailToMailchimp(email);

  // redirect to contact page with "message sent alert"
  res.redirect('/');
});

// RENDERS CONTACT PAGE
router.get('/contact', function (req, res) {
  res.render('./public/contact');
});

// POST REQUEST FOR SENDING EMAIL TO GMAIL FROM CONTACT FORM
router.post('/contact', function (req, res) {

  // get form info that was submitted to send as an email
  let email = req.body.queryEmail;
  let queryText = req.body.queryText;

  //send email to desired email address
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    port: 25,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let HelperOptions = {
    from: '"Ben Hall" <' + process.env.MAILER_USER + '>',
    to: process.env.MAILER_USER,
    subject: email,
    text: '<' + email + '>' + queryText,
  };
  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    console.log('The message was sent!');
    console.log(info);
  });

  // redirect to contact page with "message sent alert"
  res.redirect('./contact');
});

// RENDERS TREATMENTS PAGE
router.get('/prices', function (req, res) {
  Treatment.find({}, function (err, treatments) {
        if (err) {
          console.log(err);
        }else {
          res.render('./public/prices', { treatments: treatments });
        }
      });
});

module.exports = router;
