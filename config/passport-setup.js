const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const IntraStrategy = require('passport-42').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const mongo = require('mongodb');
const bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, done) => {
	console.log('serializing: ' + user);
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	console.log('deserializing: ' + id);
	var newID = new mongo.ObjectID(id);
	User.findOne({_id: newID}, function(err, user) {
		done(err, user)
	});
});

passport.use(
	new IntraStrategy({
		clientID: keys.intra.clientID,
		clientSecret: keys.intra.clientSecret,
		callbackURL: 'http://localhost:3000/auth/42/redirect'
	}, (accessToken, refreshToken, profile, done) => {
		User.findOne({oauthId: profile.id}).then((currentUser) => {
			console.log(currentUser);
			if(currentUser){
				//already have the user
				console.log('user is: ' + currentUser);
				done(null, currentUser);
			} else {
				//create new user
				new User({
					username: profile.username,
					oauthId: profile.id,
					thumbnail: profile.photos[0].value,
					first: profile.name.givenName,
					last: profile.name.familyName,
					email: profile.emails[0].value
				}).save().then((newUser) => {
					console.log('new user created: ' + newUser);
					done(null, newUser);
				});
			}
		})
	})
)

passport.use(
	new GoogleStrategy({
		//options for the google strat
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: '/auth/google/redirect'
	}, (accessToken, refreshToken, profile, done) => {
			//check if user exists
			User.findOne({oauthId: profile.id}).then((currentUser) => {
				if(currentUser){
					//already have a user...
					console.log('user is: ' + currentUser);
					done(null, currentUser);
				} else {
					//create new user
					new User({
						username: profile.displayName,
						oauthId: profile.id,
						thumbnail: profile._json.image.url,
						first: profile.name.givenName,
						last: profile.name.familyName,
						email: profile.emails[0].value
					}).save().then((newUser) => {
						console.log('new user created: ' + newUser)
						done(null, newUser);
					});
				}
			});
		})
);


passport.use(
	new LocalStrategy(
		function (username, password, done) {
			console.log(username);
			console.log(password);
			try {
				User.find({username: username}).then(res => {
					if (res.length == 1){
						console.log(res);
						let hash = bcrypt.compareSync(password, res[0].pwd);
						console.log(hash);
						if (hash)
							return (done(null, res[0]))
						else
							return (done(null, false));
					}
					else
						return (done(null, false));
				}).catch(err => {
					return (done(err));
				})
		} catch (e) {
			console.log(e);
		}
		}
	)	
);