const express    = require("express"),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require("mongoose");

app.use(express.static('public'));
app.set("view engine", "ejs");


//===============================================
// ROUTES
//===============================================

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/36hair", function(req, res){
	res.render("36hair");
});



app.listen(3000, () => console.log("36hair Server started"));
