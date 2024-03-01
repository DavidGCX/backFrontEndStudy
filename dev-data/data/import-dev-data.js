/* eslint-disable no-console */
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const https = require('https');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');
const Repo = require('../../models/repoModel');

dotenv.config({ path: './config.env' });
const DATABASE = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
)
	.replace('<USERNAME>', process.env.DATABASE_USERNAME)
	.replace('<COLLECTION>', process.env.DATABASE_COLLECTION);

mongoose.connect(DATABASE).then(() => {
	console.log('DB connection successful!');
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
	try {
		await Tour.create(tours);
		console.log('Data successfully loaded!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log('Data successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const deleteUsers = async () => {
	try {
		await User.deleteMany();
		console.log('Users successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const importUsers = async () => {
	try {
		await User.create(users, { validateBeforeSave: false });
		console.log('Users successfully loaded!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const importReviews = async () => {
	try {
		await Review.create(reviews);
		console.log('Reviews successfully loaded!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

const deleteReviews = async () => {
	try {
		await Review.deleteMany();
		console.log('Reviews successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
const httpOptions = {
	hostname: 'api.github.com',
	port: 443,
	path: '/users/DavidGCX/repos',
	method: 'GET',
	headers: {
		'User-Agent': 'nodejs',
	},
};
const updateInformation = () => {
	https.get(httpOptions, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', async () => {
			const json = JSON.parse(data);
			await Repo.deleteMany();
			await Repo.create(json);
			console.log('Repos successfully updated!');
			process.exit();
		});
	});
};

const deleteRepos = async () => {
	try {
		await Repo.deleteMany();
		console.log('Repos successfully deleted!');
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

if (process.argv[2] === '--import') {
	importData();
} else if (process.argv[2] === '--delete') {
	deleteData();
} else if (process.argv[2] === '--deleteUser') {
	deleteUsers();
} else if (process.argv[2] === '--importUser') {
	importUsers();
} else if (process.argv[2] === '--importReview') {
	importReviews();
} else if (process.argv[2] === '--deleteReview') {
	deleteReviews();
} else if (process.argv[2] === '--updateRepo') {
	updateInformation();
} else if (process.argv[2] === '--deleteRepo') {
	deleteRepos();
}
