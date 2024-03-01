const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
	const message = `Invalid input data. ${err.message}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () =>
	new AppError('Your token has expired! Please log in again!', 401);
const sendErrorDev = (err, res, req) => {
	if (req.originalUrl.startsWith('/api')) {
		res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	} else {
		console.error('ERROR 💥', err);
		res.status(err.statusCode).render('error', {
			title: 'Something went wrong!',
			msg: err.message,
		});
	}
};

const sendErrorProd = (err, res, req) => {
	if (req.originalUrl.startsWith('/api')) {
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		console.error('ERROR 💥', err);
		return res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
	if (err.isOperational) {
		res.status(err.statusCode).render('error', {
			title: 'Something went wrong!',
			msg: err.message,
		});
	} else {
		console.error('ERROR 💥', err);
		res.status(err.statusCode).render('error', {
			title: 'Something went wrong!',
			msg: 'Please try again later!',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res, req);
	} else if (process.env.NODE_ENV === 'production') {
		//let error = {... err}; this method does not copy the error object properly
		let error = Object.create(err);
		// Depending on error.kind which is very strange
		if (error.name === 'CastError') {
			error = handleCastErrorDB(error);
		}
		if (error.code === 11000) {
			error = handleDuplicateFieldsDB(error);
		}
		if (error.name === 'ValidationError') {
			error = handleValidationErrorDB(error);
		}
		if (error.name === 'JsonWebTokenError') {
			error = handleJWTError();
		}
		if (error.name === 'TokenExpiredError') {
			error = handleJWTExpiredError();
		}
		sendErrorProd(error, res, req);
	}
};
