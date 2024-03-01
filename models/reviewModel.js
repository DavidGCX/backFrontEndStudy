const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			require: [true, 'Review must be a non-empty!'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			require: [true, 'Review must belong to a tour!'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: [true, 'Review must belong to a user!'],
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	this.select('-__v');
	this.populate({
		path: 'user',
		select: 'name photo',
	});
	next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);

	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats[0].nRating,
		ratingsAverage: stats[0].avgRating.toFixed(2),
	});
};
reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.targetReview = await this.model.findOne(this._conditions).select('tour');
	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	// Can not do findOne here because the query has already executed
	await this.targetReview.constructor.calcAverageRatings(
		this.targetReview.tour,
	);
});

reviewSchema.post('save', function () {
	this.constructor.calcAverageRatings(this.tour);
});

module.exports = mongoose.model('Review', reviewSchema);
