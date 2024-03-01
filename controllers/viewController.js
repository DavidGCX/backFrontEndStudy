const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com https://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('overview', {
			title: 'All Tours',
			tours,
		});
});
exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});
	if (!tour) {
		return next(new AppError('There is no tour with that name.', 404));
	}
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com https://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('tour', {
			title: `${tour.name} Tour`,
			tour,
		});
});

exports.getLoginForm = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('login', {
			title: 'Log into your account',
		});
};

exports.getSignupForm = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('signUp', {
			title: 'Sign Up Today!',
		});
};

exports.getAccount = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('account', {
			title: 'My Account',
		});
};

exports.getForgetPasswordForm = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('forgetPassword', {
			title: 'Forget Password',
		});
};

exports.getResetPasswordForm = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('resetPassword', {
			title: 'Reset Password',
		});
};

exports.updateUserData = catchAsync(async (req, res, next) => {
	console.log('UPDATING USER', req.body);
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		},
	);
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('account', {
			title: 'Your account',
			user: updatedUser,
		});
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	const user = await User.findOne({
		verifyToken: hashedToken,
		verifyTokenExpires: { $gt: Date.now() },
	});
	if (!user) {
		return next(
			new AppError(
				'Token is invalid or has expired. Please request a new one by log in!',
				400,
			),
		);
	}
	user.emailVerified = true;
	user.verifyToken = undefined;
	user.verifyTokenExpires = undefined;
	await user.save({ validateBeforeSave: false });
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('emailVerified', {
			title: 'Email Verified',
		});
});

exports.emailWaitForVerify = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1:3000 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('emailWaitForVerified', {
			title: 'Email Wait for Verify',
		});
};
