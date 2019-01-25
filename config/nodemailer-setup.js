const nodemailer = require('nodemailer');
const keys = require('./keys');


var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: keys.email.user,
		pass: keys.email.pass
	}
});