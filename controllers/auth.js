var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var session = require('express-session');
var isLoggedIn = require('../middleware/isLoggedIn');
var flash = require ('connect-flash');

var app = express();

app.use(flash());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
});

router.get('/signup', function(req, res) {
  var user = req.user;
  res.render('auth/signup', {user: user});
});

router.get('/login', function(req, res) {
  var user = req.user;
  res.render('auth/login', {user: user});
});

router.post('/signup', function(req, res) {
	db.user.findOrCreate({
		where: { email: req.body.email },
		defaults: {
			name: req.body.name,
			password: req.body.password
		}
	}).spread(function(user, created) {
		if(created) {
			passport.authenticate('local', {
				successRedirect: '/',
				successFlash: 'Account created and logged in'
			})(req, res);
		}
		else {
			req.flash('Error', 'email exists already')
			res.redirect('/auth/login');
		}
	}).catch(function(error) {
		req.flash('error', 'An error occurred: ' + error.message);
		res.redirect('/auth/signup');
	});
});	
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid credentials',
	successFlash: 'Successfully logged in'
}));

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'logged out');
	res.redirect('/');
});

module.exports = router;
