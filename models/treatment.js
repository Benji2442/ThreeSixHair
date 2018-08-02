var mongoose = require("mongoose");

var treatmentSchema = new mongoose.Schema({
	group:{type: String, required: true},
	name:{type: String, required: true},
	price:{type: String, required: true},
	desc:{type: String}
});

module.exports = mongoose.model("Treatment", treatmentSchema);
