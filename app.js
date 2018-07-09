const express    = require("express"),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require("mongoose");

app.use(express.static('public'));
mongoose.connect("mongodb://localhost/TShair");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

//===============================================
// MONGOOSE SCHEMA
//===============================================

var contactQuerySchema = new mongoose.Schema({
    queryEmail: String,
    queryText: String
});

var Query = mongoose.model("TShairQuery", contactQuerySchema);


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
		let queryEmail = req.body.queryEmail;
    let queryText = req.body.queryText;
    let newQuery = {queryEmail:queryEmail,queryText:queryText};
    Query.create(newQuery, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("contact");
        }
    });
});

app.get("/treatments", function(req, res){
	res.render("treatments");
});

app.listen(3000, () => console.log("36hair Server started"));
