const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.use(authController.protect);
reviewRouter
	.route('/')
	.post(
		authController.restrictTo('user'),
		reviewController.setTourUserIds,
		reviewController.createReview,
	)
	.get(reviewController.getAllReview);
reviewRouter
	.route('/:id')
	.get(authController.restrictTo('admin', 'user'), reviewController.getReview)
	.patch(
		authController.restrictTo('admin', 'user'),
		reviewController.updateReview,
	)
	.delete(
		authController.restrictTo('admin', 'user'),
		reviewController.deleteReview,
	);

module.exports = reviewRouter;
