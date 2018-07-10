const express     = require("express"),
      app         = express(),
      bodyParser  = require('body-parser'),
      mongoose    = require("mongoose"),
			nodemailer  = require("nodemailer");

app.use(express.static('public'));
mongoose.connect("mongodb://localhost/TShair");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

//===============================================
// MONGOOSE SCHEMA
//===============================================

var contactEmailSchema = new mongoose.Schema({
    queryEmail: String
});

var contactEmail = mongoose.model("TShairEmail", contactEmailSchema);


//===============================================
// ROUTES
//===============================================

app.get("/", function(req, res){
    res.render("36hair");
});

app.get("/contact", function(req, res){
	res.render("contact");
});

app.post("/contact", function(req, res){

		// get form info that was submitted
		let queryEmail = req.body.queryEmail;
    let queryText = req.body.queryText;
    let newEmail = {queryEmail:queryEmail};

		// check email address isnt already in teh database
		// add email address to data base
		contactEmail.create(newEmail, function(err){
        if(err){
            console.log(err);
        }
    });

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
			subject: queryEmail,
			text: "<"+queryEmail+">"+ queryText
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

app.get("/treatments", function(req, res){
	res.render("treatments");
});

app.listen(3000, () => console.log("36hair Server started"));
