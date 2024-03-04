const mongoose = require('mongoose');
const AppointmentSchema = new mongoose.Schema({
	apptDate: {
		type: Date,
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	coWork: {
		type: mongoose.Schema.ObjectId,
		ref: 'CoWork',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	date: {
        type:String,
        required : true
    },
    startTime:{
		type: String,
		required : true
	},
	endTime:{
		type: String,
		required : true
	},
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
