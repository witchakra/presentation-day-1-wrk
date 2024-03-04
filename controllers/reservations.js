const Reservation = require('../models/Reservation');
const CoWork = require('../models/CoWork');

// @desc    Get all reservations
// @route   GET /api/v1/reservations
// @access  Public
exports.getReservations = async (req, res, next) => {
	let query;
	//General users can see only their reservations!
	if (req.user.role !== 'admin') {
		query = Reservation.find({user: req.user.id}).populate({
			path: 'coWork',
			select: 'name province tel',
		});
	} else {
		// If you are an admin, you can see all!
		if (req.params.coWorkId) {
			console.log(req.params.coWorkId);
			query = Reservation.find({coWork: req.params.coWorkId}).populate({
				path: 'coWork',
				select: 'name province tel',
			});
		} else
			query = Reservation.find().populate({
				path: 'coWork',
				select: 'name province tel',
			});
	}
	try {
		const reservations = await query;
		res.status(200).json({
			success: true,
			count: reservations.length,
			data: reservations,
		});
	} catch (err) {
		console.log(err.stack);
		return res
			.status(500)
			.json({success: false, message: 'Cannot find Reservation'});
	}
};

// @desc    Get single reservation
// @route   GET /api/v1/reservations/:id
// @access  Public
exports.getReservation = async (req, res, next) => {
	try {
		const reservation = await Reservation.findById(req.params.id).populate({
			path: 'coWork',
			select: 'name description tel',
		});

		if (!reservation) {
			return res.status(404).json({
				success: false,
				message: `No reservation with the id of ${req.params.id}`,
			});
		}
		res.status(200).json({success: true, data: reservation});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({success: false, message: 'Cannot find Reservation'});
	}
};

// @desc    Add reservation
// @route   POST /api/v1/coWorks/:coWorkId/reservations/
// @access  Private
exports.addReservation = async (req, res, next) => {
	try {
		req.body.coWork = req.params.coWorkId;

		const coWork = await CoWork.findById(req.params.coWorkId);

		if (!coWork) {
			return res.status(404).json({
				success: false,
				message: `No reservation with the id of ${req.params.coWorkId}`,
			});
		}
		// Add user Id to req body
		req.body.user = req.user.id;

		// Check for existed reservation
		const existedReservations = await Reservation.find({user: req.user.id});

		// If the user is not an admin, they can only create 3 reservation.
		if (existedReservations.length >= 3 && req.user.role !== 'admin') {
			return res.status(400).json({
				success: false,
				message: `The user with ID ${req.user.id} has already made 3 reservations`,
			});
		}
		if(req.body.startTime < coWork.Open_time){
			return res.status(400).json({
				success: false,
				message: `startTime earlier than open time ${coWork.Open_time}`
			});
		}
		if(req.body.endTime > coWork.Close_time){
			return res.status(400).json({
				success: false,
				message: `endTime later than close time ${coWork.Close_time}`
			});
		}

		if(req.body.startTime >= req.body.endTime){
			return res.status(400).json({
				success: false,
				message: 'startTime and endTime is invalid value'
			});
		}

	} catch (err) {
		console.log(err.stack);
		return res
			.status(500)
			.json({success: false, message: 'Cannot create Reservation'});
	}
};

// @desc    Update reservation
// @route   PUT /api/v1/reservations/:id
// @access  Private
exports.updateReservation = async (req, res, next) => {
	try {
		let reservation = await Reservation.findById(req.params.id);

		if (!reservation) {
			return res.status(404).json({
				success: false,
				message: `No reservation with the id of ${req.params.id}`,
			});
		}
		// Make sure user is the reservation owner
		if (
			reservation.user.toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return res.status(401).json({
				success: false,
				message: `User ${req.user.id} is not authorized to update this reservation`,
			});
		}
		reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: reservation,
		});
	} catch (err) {
		console.log(err.stack);
		return res
			.status(500)
			.json({success: false, message: 'Cannot update Reservation'});
	}
};

// @desc    Delete reservation
// @route   DELETE /api/v1/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res, next) => {
	try {
		const reservation = await Reservation.findById(req.params.id);

		if (!reservation) {
			return res.status(404).json({
				success: false,
				message: `No reservation with the id of ${req.params.id}`,
			});
		}
		// Make sure user is the reservation owner
		if (
			reservation.user.toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return res.status(401).json({
				success: false,
				message: `User ${req.user.id} is not authorized to delete this bootcamp`,
			});
		}
		await reservation.deleteOne();

		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (err) {
		console.log(err.stack);
		return res
			.status(500)
			.json({success: false, message: 'Cannot delete Reservation'});
	}
};