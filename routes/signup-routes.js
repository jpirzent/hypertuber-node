const router = require('express').Router();
const User = require('../models/user-model');
const bcrypt = require('bcrypt-nodejs');
const functions = require('../functions/functions');
const nodemailer = require('nodemailer');
const keys = require('../config/keys');


var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: keys.email.user,
		pass: keys.email.pass
	}
});


const AuthCheck = (req, res, next) => {
	console.log(req.session.passport);
	if(!req.session.passport)
	{
		if (!req.session.passport.user)
		{
			//if not logged in
			next();
		}
	}
	else
	{
		//if user logged in
		res.redirect('/');
	}
};


router.get('/', AuthCheck, (req, res) => {
	console.log('going to: /signup')
	res.render('signup');
});

router.post('/send', (req, res) => {
	console.log(req.body);
	//validate inputs
	req.check('email', 'Email is Required').exists({checkFalsy: true});
	req.check('email', 'Email is Invalid').isEmail();
	req.check('first', 'First Name is Required').exists({checkFalsy: true});
	req.check('last', 'Last Name is Required').exists({checkFalsy: true});
	req.check('uid', 'Username is Required').exists({checkFalsy: true});
	req.check('pwd', 'Password is Required').exists({checkFalsy: true});

	var errors = req.validationErrors();
	if (errors)
	{
		//req.session.errors = err;
		//req.session.success = false;
		console.log(errors);
		res.send(JSON.stringify({
			status: 197
		}));
	}
	else
	{
		User.findOne({ username: req.body.uid }).then((ret) => {
			if (ret)
			{
				//add error for username already taken
				console.log('err: ' + ret);
				res.send(JSON.stringify({
					status: 198
				}));
			}
			else
			{
				User.findOne({ email: req.body.email }).then((currentUser) => {
					if(currentUser){
						//already have a user...
						console.log('user is: ' + currentUser);
						res.send(JSON.stringify({
							status: 199
						}));
					} else {
						//hash password
						var hashedpwd = bcrypt.hashSync(req.body.pwd);
						//create new user
						new User({
							username: functions.htmlEntities(req.body.uid),
							oauthId: null,
							thumbnail: null,
							first: functions.htmlEntities(req.body.first),
							last: functions.htmlEntities(req.body.last),
							email: functions.htmlEntities(req.body.email),
							pwd: hashedpwd
						}).save().then((newUser) => {
							console.log('new user created: ' + newUser)
							res.send(JSON.stringify({
								status: 200
							}));
						});
					}
				});
			}
		});
	}
	
	//Validate inputs, and Add information into db
	console.log('going to: /signup/send');
})


//forgot pwd

router.get('/forgotpwd', (req, res) => {
	res.render('forgot');
});

router.post('/forgotpwd/send', (req, res) => {
	req.check('email', 'Email is Required').exists({checkFalsy: true});
	req.check('email', 'Email is Invalid').isEmail();
	req.check('uid', 'Username is Required').exists({checkFalsy: true});

	var errors = req.validationErrors();
	if (errors)
	{
		//req.session.errors = err;
		//req.session.success = false;
		console.log(errors);
		res.send(JSON.stringify({
			status: 197
		}));
	}
	else
	{
		User.findOne({ username: req.body.uid }).then((ret) => {
			if (!ret)
			{
				console.log('there was an error...');
				res.send(JSON.stringify({
					status: 999
				}));
			}
			else
			{
				var npwd = Math.floor(Math.random() * 99999999) + 10000000;
				var hnpwd = bcrypt.hashSync(npwd);
				User.updateOne({ username: req.body.uid }, { $set: { pwd: hnpwd } }, (err, res) => {
					if (err)
					{
						console.log('there was an error: ');
						console.log(err);
						res.send(JSON.stringify({
							status: 999
						}));
					}
					else
					{
						console.log('update successfull');
					}
				});

				var mailOptions = {
					from: keys.email.user,
					to: ret.email,
					subject: 'Change Your Password',
					html: '<head><title>HyperTube Change Password</title></head><body><p>Please use '+ npwd +' to login to your Account</p><br /></body>'
				};

				transporter.sendMail(mailOptions, (err, info) => {
					if (err)
					{
						console.log(err);
						res.send(JSON.stringify({
							status: 999
						}));
					}
					else
					{
						console.log('email was sent: ' + info.response);
						res.send(JSON.stringify({
							status: 205
						}));
					}
				});
			}
		});
	}
});


module.exports = router;