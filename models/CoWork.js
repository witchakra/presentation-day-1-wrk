const mongoose = require('mongoose');

const CoWorkSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
			unique: true,
			trim: true,
			maxlength: [50, 'Name can not be more than 50 characters'],
		},
		address: {
			type: String,
			required: [true, 'Please add an address'],
		},
		district: {
			type: String,
			required: [true, 'Please add a district'],
		},
		province: {
			type: String,
			required: [true, 'Please add a province'],
		},
		postalcode: {
			type: String,
			required: [true, 'Please add a postalcode'],
			maxlength: [5, 'Postal Code can not be more than 5 digits'],
		},
		region: {
			type: String,
			required: [true, 'Please add a region'],
		},
		tel: {
			type: String,
		},
		Open_time:{
			type: String,
			required:[true, 'Please add Open_time'],
		},
		Close_time:{
			type: String,
			required:[true, 'Please add Close_time'],
		},
	},
	{
		toJSON: {virtuals: true},
		toObject: {virtuals: true},
	}
);

// Cascade delete reservations when a coWork is deleted
CoWorkSchema.pre(
	'deleteOne',
	{document: true, query: false},
	async function (next) {
		console.log(`Reservations being removed from coWork ${this._id}`);
		await this.model('Reservation').deleteMany({coWork: this._id});
		next();
	}
);

// Reverse populate with virtuals
CoWorkSchema.virtual('reservations', {
	ref: 'Reservation',
	localField: '_id',
	foreignField: 'coWork',
	justOne: false,
});

module.exports = mongoose.model('CoWork', CoWorkSchema);
