const express = require('express');
const authController = require('../controllers/authController');

const toursRouter = express.Router();
const tourController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');
// re route to reviewRouter
toursRouter.use('/:tourId/reviews', reviewRouter);

// Check ID exist
// toursRouter.param('id', tourController.checkID);

toursRouter
	.route('/top-5-cheap')
	.get(
		authController.protect,
		tourController.aliasTopTours,
		tourController.getAllTours,
	);
toursRouter
	.route('/tour-stats')
	.get(authController.protect, tourController.getTourStats);
toursRouter
	.route('/monthly-plan/:year')
	.get(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide', 'guide'),
		tourController.getMonthlyPlan,
	);
// /tours-within/233/center/34.111745,-118.113491/unit/mi
toursRouter
	.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(tourController.getToursWithin);
toursRouter
	.route('/distances/:latlng/unit/:unit')
	.get(tourController.getDistances);
toursRouter
	.route('/')
	.get(tourController.getAllTours)
	.post(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.createTour,
	);
toursRouter
	.route('/:id')
	.get(tourController.getTour)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.uploadTourImages,
		tourController.resizeTourImages,
		tourController.updateTour,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'lead-guide'),
		tourController.deleteTour,
	);

module.exports = toursRouter;
