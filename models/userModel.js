const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// create user schema
const loginTrySchema = new mongoose.Schema({
	IP: {
		type: String, // Using String to store IPs to accommodate IPv6
		required: true,
	},
	success: {
		type: Boolean,
		required: true,
	},
	time: {
		type: Date,
		required: true,
		default: Date.now, // Automatically set to the current time
	},
});
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!'],
	},
	email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	photo: {
		type: String,
		default: 'default.jpg',
	},
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			// This only works on CREATE and SAVE
			validator: function (el) {
				return el === this.password;
			},
			message: 'Passwords are not the same!',
		},
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	verifyToken: String,
	verifyTokenExpires: Date,
	loginAttempts: {
		type: Number,
		default: 0,
		select: false,
	},
	lockUntil: Date,
	IntervalRecordLogin: { type: [loginTrySchema], select: false },
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	lastLockAt: Date,
	emailVerified: {
		type: Boolean,
		default: false,
	},
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// encoding passwords
userSchema.pre('save', async function (next) {
	// this function only runs if password was actually modified
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	// after create we do not need to store passwordConfirm
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);
		return JWTTimestamp < changedTimestamp;
	}
	// False means NOT changed
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.passwordResetExpires =
		Date.now() + process.env.PASSWORD_RESET_EXPIRES_IN_MINUTE * 60 * 1000;
	return resetToken;
};

userSchema.methods.createVerifyToken = function () {
	const verifyToken = crypto.randomBytes(32).toString('hex');
	this.verifyToken = crypto
		.createHash('sha256')
		.update(verifyToken)
		.digest('hex');
	this.verifyTokenExpires =
		Date.now() + process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN_MINUTE * 60 * 1000;
	return verifyToken;
};

userSchema.methods.lockAccount = function (minutes) {
	this.lockUntil = Date.now() + minutes * 60 * 1000;
	this.lastLockAt = Date.now();
};

userSchema.methods.recordLogin = function (IP, success) {
	this.IntervalRecordLogin.push({ IP, success });
	if (this.IntervalRecordLogin.length > process.env.LOGIN_RECORD_LENGTH) {
		this.IntervalRecordLogin.shift();
	}
	// check records make sure no more than 10 attempts in 1 minutes
	// starting count from last lock time or the interval whenever is shorter
	let timeLimit;
	if (this.lastLockAt) {
		timeLimit = Math.max(
			Date.now() - process.env.LOGIN_TOO_FREQUENT_INTERVAL_MINUTE * 60 * 1000,
			this.lastLockAt,
		);
	} else {
		timeLimit =
			Date.now() - process.env.LOGIN_TOO_FREQUENT_INTERVAL_MINUTE * 60 * 1000;
	}

	const attempts = this.IntervalRecordLogin.filter(
		(record) => record.time > timeLimit,
	);
	// only count failed attempts
	attempts.filter((record) => !record.success);

	// not refreshing time after being locked
	if (
		attempts.length > process.env.LOGIN_TOO_FREQUENT_MAX_ATTEMPT &&
		!this.lockUntil
	) {
		this.lockAccount(process.env.LOGIN_TOO_FREQUENT_LOCK_UNTIL_MINUTE);
	}
	if (success) {
		this.loginAttempts = 0;
	}
};

userSchema.methods.loginAttempt = function () {
	if (this.lockUntil) {
		const lockTimestamp = parseInt(this.lockUntil.getTime(), 10);
		if (lockTimestamp > Date.now()) {
			return false;
		}
		this.lockUntil = undefined;
		this.loginAttempts = 0;
		return true;
	}
	if (this.loginAttempts >= process.env.LOGIN_MAXIMUM_ATTEMPT) {
		this.lockAccount(process.env.LOGIN_MAX_ATTEMPT_LOCK_UNTIL_MINUTE);
		return false;
	}
	this.loginAttempts += 1;

	return true;
};

module.exports = mongoose.model('User', userSchema);
