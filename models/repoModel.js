const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, 'Repo name is required!'],
		},
		description: {
			type: String,
		},
		html_url: {
			type: String,
			require: [true, 'Repo URL is required!'],
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		updated_at: {
			type: Date,
			default: Date.now,
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

module.exports = mongoose.model('Repo', repoSchema);
