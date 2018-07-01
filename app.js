const express    = require("express"),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require("mongoose");

app.use(express.static('public'));
mongoose.connect("mongodb://localhost/36hair");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))

//===============================================
// MONGOOSE SCHEMA
//===============================================

var contactQuerySchema = new mongoose.Schema({
    queryEmail: String,
    queryText: String,
    queryPicture: String
});

var Query = mongoose.model("36hairQuery", contactQuerySchema);


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

});

app.listen(3000, () => console.log("36hair Server started"));
