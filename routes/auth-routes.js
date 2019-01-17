const router = require('express').Router();
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
	res.redirect('/profile/');
});


//auth intra
router.get('/42', passport.authenticate('42'));

//callback for intra
router.get('/42/redirect', passport.authenticate('42'), (req, res) => {
	console.log('going to: /42/redirect');
	res.redirect('/profile/');
});


module.exports = router;