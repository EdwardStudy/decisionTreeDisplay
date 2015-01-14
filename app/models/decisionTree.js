var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

/**
 * decisionTree Schema
 *
 */
var decisionTreeSchema = new Schema(
	config: {
		name: { type: String },
		description: { type: String },
		last_saved: { type: Date, Date.now}, //how to set a Data
		security_level: { type: String },
		layout_style: { type: String },
		depth: { type: Number },
		layer_width: { type: [] }, //Number
		show_title: { type: Boolean },
		show_info: { type: Boolean },
		show_default_info: { type: Boolean },
		show_compiled_info: { type: Boolean },
		show_parsed_info: { type: Boolean },
		show_variable: { type: Boolean },
		show_tracker: { type: Boolean },
		show_payoff: { type: Boolean },
	},
	parameter: {
		pid: { type: Number },
		name: { type: String },
		formula: { type: String },
		category: { type: String },
		display: { type: Boolean },
		description: { type: String },
	},
	structure: {}

);