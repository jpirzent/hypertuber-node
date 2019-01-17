const router = require('express').Router();
const User = require('../models/user-model');

const authCheck = (req, res, next) => {
	console.log('next line is req.session.passport...');
	console.log(req.session.passport);
	if(!req.session.passport)
	{
		//if user not logged in
		res.redirect('/auth/login');
	}
	else
	{
		//if logged in
		User.findById(req.session.passport.user, function(err, user) {
			if (err)
			{
				throw err;
			}
			req.session.user = user;
			next();
		});
	}
};

router.get('/', authCheck, (req, res) => {
	console.log('going to: /profile');
	console.log('next line is req.session.user...');
	console.log(req.session.user);
	res.render('profile', { user: req.session.user });
});

module.exports = router;