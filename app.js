const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const signupRoutes = require('./routes/signup-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const session = require('express-session');

const app = express();


//setup view engine
app.set('view engine', 'ejs');

app.use(session({secret: "American Pie: Beta House", saveUninitialized: false, resave: false}));

//init passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }, () => {
	console.log('connected to mongo');
});

//setup routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/signup', signupRoutes);


//create home page route
app.get('/', (req, res) => {
	console.log('going to: /home');
	res.render('home', { user: req.user });
});


app.listen(3000, () => {
	console.log('app now listening on port 3000');
});