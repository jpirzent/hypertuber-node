const router = require('express').Router();
const functions = require('../functions/functions');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//auth Login
router.get('/login', (req,res) => {
	console.log('going to: /login');
	res.render('login', { user: req.user });
});

//auth logout
router.get('/logout', (req,res) => {
	//handle with passport
	console.log('going to: /logout');
	req.session.user = null;
	req.logout();
	res.redirect('/');
});

//auth google
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	//res.send(req.user);
	// req.session.user = user;
	console.log('going to: /google/redirect');
	User.findById(req.session.passport.user, function(err, user) {
		if (err)
		{
			console.log('there was an err...');
			res.send(JSON.stringify({
				status: 999
			}));
			throw err;
		}
		//req.session.user = user;
		else {
			const loginUser = {
				username: user.username,
				oauthId: user.oauthId,
				thumnail: user.thumnail,
				first: user.first,
				last: user.last,
				email: user.email,
				pwd: user.pwd
			};

			jwt.sign({loginUser}, 'ChangeThisLater', { expiresIn: '24h' }, (err, token) => {
				res.json({
					token
				});
			});

			res.send(JSON.stringify({
				status: 201
			}));
		}
	});
});


//auth intra
router.get('/42', passport.authenticate('42'));

//callback for intra
router.get('/42/redirect', passport.authenticate('42'), (req, res) => {
	console.log('going to: /42/redirect');
	
	User.findById(req.session.passport.user, function(err, user) {
		if (err)
		{
			console.log('there was an err...');
			res.send(JSON.stringify({
				status: 999
			}));
			throw err;
		}
		else {
			const loginUser = {
				username: user.username,
				oauthId: user.oauthId,
				thumbnail: user.thumbnail,
				first: user.first,
				last: user.last,
				email: user.email,
				pwd: user.pwd
			};
			jwt.sign({loginUser}, 'ChangeThisLater', { expiresIn: '24h' }, (err, token) => {
				res.json({
					token
				});
			});
			res.send(JSON.stringify({
				status: 202
			}));
		}
	});
});


//auth local
router.post('/local', passport.authenticate('local', {failureRedirect: '/local/fail'} ));

//callback for local
router.get('/local/redirect', passport.authenticate('local'), (req, res) => {
	console.log('going to: /local/redirect');
	

	User.findById(req.session.passport.user, function(err, user) {
		if (err)
		{
			console.log('there was an err...');
			res.send(JSON.stringify({
				status: 999
			}));
			throw err;
		}
		else {
			const loginUser = {
				username: user.username,
				oauthId: user.oauthId,
				thumbnail: user.thumbnail,
				first: user.first,
				last: user.last,
				email: user.email,
				pwd: user.pwd
			};
			jwt.sign({loginUser}, 'ChangeThisLater', { expiresIn: '24h' }, (err, token) => {
				res.json({
					token
				});
			});
			res.send(JSON.stringify({
				status: 203
			}));
		}
	});
});


module.exports = router;