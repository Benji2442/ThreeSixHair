const express               = require("express"),
      passportLocalMongoose = require("passport-local-mongoose"),
			methodOverride 	      = require("method-override"),
			LocalStrategy  	      = require("passport-local"),
			bodyParser     	      = require('body-parser'),
			passport              = require("passport"),
			mongoose       	      = require("mongoose"),
			nodemailer     	      = require("nodemailer"),
			request        	      = require("request"),
      app            	      = express();

//===============================================
// MODELS
//===============================================
const Treatment      = require("./models/treatment.js"),
      User           = require("./models/user.js");

//===============================================
// CONFIG
//===============================================
app.use(express.static(__dirname +'/public'));
mongoose.connect("mongodb://Benji2442:Fqks5c2442@ds247191.mlab.com:47191/threesixhair");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

//===============================================
// PASSPORT CONFIG
//===============================================

app.use(require("express-session")({
    secret:"Charlie Hall",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===============================================
// FUNCTIONS & MIDDLEWARE
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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

//===============================================
// ROUTES
//===============================================

// RENDERS LANDING PAGE
app.get("/", function(req, res){
    res.render("./public/36hair");
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
	res.render("./public/contact");
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
		res.redirect('./public/contact');
});

// RENDERS TREATMENTS PAGE
app.get("/prices", function(req, res){
	Treatment.find({}, function(err, treatments){
        if(err){
            console.log(err);
        }else{
            res.render("./public/prices", {treatments: treatments});
        }
    });
});

//===============================================
// LOGIN ROUTES
//===============================================

// RENDER SIGN UP FORM FOR ONE TIME ONLY
app.get("/register",isLoggedIn, function(req, res){
	res.render("./admin/register");
});

// HANDLING USER SIGN UP
app.post("/register", function(req, res){
	User.register(new User({username:req.body.user.username}), req.body.user.password, function(err, user){
		if(err){
            console.log(err);
            return res.render("./admin/register");
        }else{
            passport.authenticate("local")(req, res, function(){
            res.redirect("./admin/treatments");
            });
				}
	});
});

// RENDER LOGIN FORM
app.get("/login", function(req, res){
	res.render("./admin/login");
});

//  HANDLE LOGIN REQUEST
app.post("/login", passport.authenticate("local",{
    successRedirect:"/treatments",
    failureRedirect:"/login"
}), function(req, res){
});

// LOGOUT button
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


//===============================================
// ADMIN ROUTES
//===============================================

// RENDERS TABLE OF ALL TREATMENTS
app.get("/treatments", isLoggedIn, function(req, res){
	Treatment.find({}, function(err, treatments){
        if(err){
            console.log(err);
        }else{
            res.render("./admin/treatments", {treatments: treatments});
        }
    });
});

// RENDERS NEW TREATMENTS PAGE
app.get("/treatments/new", isLoggedIn, function(req, res){
	res.render("./admin/add-treatment");
});

// CREATE ROUTE
app.post("/treatments/new", function(req, res){
	Treatment.create(req.body.treatment, function(err, newTreatment){
		if(err){
			console.log(err);
			res.render("/");
		}else{
			res.redirect("./admin/treatments");
		}
	})
});

// EDIT ROUTE
app.get("/treatments/:id/edit", isLoggedIn, function(req, res){
	Treatment.findById(req.params.id, function(err, foundTreatment){
		if(err){
			res.redirect("./admin/treatments");
		}else{
			res.render("./admin/edit-treatment", {treatment: foundTreatment});
		}
	});
});

// UPDATE ROUTES
app.put("/treatments/:id", function(req, res){
	Treatment.findByIdAndUpdate(req.params.id, req.body.treatment, function(err, updatedTreatment){
		if(err){
        console.log(err);
    }else{
        res.redirect("./admin/treatments");
    }
	});
});

// DELETE ROUTES
app.delete("/treatments/:id", function(req, res){
	Treatment.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("./admin/treatments");
		}else{
			res.redirect("./admin/treatments");
		}
	});
});


app.listen(process.env.PORT || 3000, () => console.log("36hair Server started"));
