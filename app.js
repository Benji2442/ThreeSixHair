const express     = require("express"),
      app         = express(),
      bodyParser  = require('body-parser'),
      // mongoose    = require("mongoose"),
			nodemailer  = require("nodemailer"),
			request     = require("request");

app.use(express.static('public'));
// mongoose.connect("mongodb://localhost/TShair"); NOT IN USE AT THE MOMENT!!!
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

//===============================================
// MONGOOSE SCHEMA    NOT IN USE AT THE MOMENT!!!! USING MAILCHIMP INSTEAD
//===============================================

// var queryContactEmailSchema = new mongoose.Schema({
//     email: String
// });
//
// var queryContactEmail = mongoose.model("TShairEmail", queryContactEmailSchema);

//===============================================
// EMAIL TO MAILCHIMP FUNCTION
//===============================================

function addEmailToMailchimp(email){
	var options = { method: 'POST',
  url: 'https://us18.api.mailchimp.com/3.0/lists/c13587663f/members',
  headers:
   { 'Postman-Token': 'c2acb848-e135-4fcf-bcf9-1c249281eba6',
     'Cache-Control': 'no-cache',
     Authorization: 'Basic YW55c3RyaW5nOmQzOTBkZTI3NmEwZjMxNzA1MGQ2ODk5MDQyNDljNWNlLXVzMTg=',
     'Content-Type': 'application/json' },
  body: { email_address: email, status: 'subscribed' },
  json: true };

	request(options, function (error, response, body) {
	  if (error) throw new Error(error);

		  console.log(body);
	});
}

//===============================================
// ROUTES
//===============================================

// RENDERS LANDING PAGE
app.get("/", function(req, res){
    res.render("36hair");
});

// POST REQUEST FOR SENDING EMAIL TO MAILCHIMP LIST
app.post("/", function(req, res){

	// get form info that was submitted & submit to mailchimp
	let email = req.body.mailingEmail;
	addEmailToMailchimp(email);

	// redirect to contact page with "message sent alert"
	res.redirect('/');
});

// RENDERS CONTACT PAGE
app.get("/contact", function(req, res){
	res.render("contact");
});

// POST REQUEST FOR SENDING EMAIL TO GMAIL FROM CONTACT FORM
app.post("/contact", function(req, res){

		// get form info that was submitted to send as an email
		let email = req.body.queryEmail;
    let queryText = req.body.queryText;

		//send email to desired email address
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			secure: false,
			port: 25,
			auth: {
				user: "Benjamin.hall2442@gmail.com",
				pass: "Fqks5c2442"
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		let HelperOptions = {
			from: '"Ben Hall" <Benjamin.hall2442@gmail.com>',
			to: 'Benjamin.hall2442@gmail.com',
			subject: email,
			text: "<"+email+">"+ queryText
		};
		transporter.sendMail(HelperOptions,(error, info) => {
			if(error){
			 return	console.log(error);
			}
			console.log("The message was sent!");
			console.log(info);
		});

		// redirect to contact page with "message sent alert"
		res.redirect('contact');
});

// RENDERS TREATMENTS PAGE
app.get("/treatments", function(req, res){
	res.render("treatments");
});

app.listen(process.env.PORT || 3000, () => console.log("36hair Server started"));
