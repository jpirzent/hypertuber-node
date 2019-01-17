const router = require('express').Router();


const AuthCheck = (req, res, next) => {
	if(req.session.passport)
	{
		//if user logged in
		res.redirect('/home');
	}
	else
	{
		//if not logged in
		next();
	}
};


router.get('/', AuthCheck, (req, res) => {
	console.log('going to: /signup')
	res.render('signup');
});

module.exports = router;