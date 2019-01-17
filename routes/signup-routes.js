const router = require('express').Router();
const User = require('../models/user-model');


const AuthCheck = (req, res, next) => {
	if(!req.session.passport)
	{
		//if not logged in
		next();
	}
	else
	{
		//if user logged in
		res.redirect('/');
	}
};

function htmlEntities(str){
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};


router.get('/', AuthCheck, (req, res) => {
	console.log('going to: /signup')
	res.render('signup');
});

router.post('/send', (req, res) => {
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
	}
	else
	{
		User.findOne({ username: req.body.uid }).then((ret) => {
			if (ret)
			{
				//add error for username already taken
				console.log('err: ' + ret);
			}
			else
			{
				User.findOne({ email: req.body.email }).then((currentUser) => {
					if(currentUser){
						//already have a user...
						console.log('user is: ' + currentUser);
					} else {
						//create new user
						new User({
							username: req.body.uid,
							oauthId: null,
							thumbnail: null,
							first: req.body.first,
							last: req.body.last,
							email: req.body.email
						}).save().then((newUser) => {
							console.log('new user created: ' + newUser)
						});
					}
				});
			}
		});
	}
	
	//Validate inputs, and Add information into db
	console.log('going to: /signup/send');
	res.redirect('/signup');
})

module.exports = router;