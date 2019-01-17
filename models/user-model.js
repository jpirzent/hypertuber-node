const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const findOrCreate = require('findOrCreate');
const userSchema = new Schema({
	username: String,
	googleId: String,
	thumbnail: String,
	first: String,
	last: String,
	email: String
});

// User.plugin('findOrCreate');

const User = mongoose.model('user', userSchema);

module.exports = User;