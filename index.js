// REQUIRE 
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var request = require('request');
require('dotenv').config();
var session = require('express-session');
var passport = require('./config/ppConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var flash = require ('connect-flash');
var db = require('./models');

// GLOBAL VARIABLES
var app = express();


// ANY USE OR SET STATEMENTS THAT WE NEED
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(session({
	secret: process.env.SESSION_SECRET_KEY,
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
});

// DEFINE ROUTES/PATHS
app.get('/', function(req, res) {
	var user = req.user;
	res.render('about', {user: user});
});

// GALLERY PAGE WHERE USERS CAN VIEW THEIR SAVED IMAGES
app.get('/gallery', function(req, res) {
	var user = req.user;
	if(user) {
		db.favorite.findAll({
			where: {userId: user.id}
		}).then(function(favorite) {
			res.render('gallery', {user:user, favorite: favorite})
		});
	}
	else {
		res.render('gallery', {user: null, favorite: null});
	}
});

app.delete('/gallery/:id', function(req, res) {
	db.favorite.findById(req.params.id).then(function(url) {
		if(url) {
			url.destroy().then(function() {
				res.send({msg: 'success'});
				req.flash('success','Deleted image');
				res.redirect('/gallery');
			})
		}
		else {
			res.status(404).send({msg:'error,try again'});
		}
	}).catch(function(err) {
		res.status(500).send({msg:'error'});
	});
});

// NASA PICTURE OF THE DAY PAGE
app.get('/apod', function(req, res) {
	var user = req.user;
	res.render('apod', {user: user});
});

app.post('/apod', function(req, res) {
	var user = req.user;
	var hdUrl = req.body.hdImg
	var imgTitle= req.body.hdTitle
	db.favorite.findOrCreate({
		where: {
			userId: user.id,
			hdurl: hdUrl,
			title: imgTitle
		}
	}).spread(function(favorite, wasCreated) {
		if (wasCreated) {
			req.flash('success','Saved image in gallery');
			res.redirect('/apod');
		}
		else {
			req.flash('error','Already saved image in gallery');
			res.redirect('/apod');
		}
	});
});

app.get('/nasaimg/:date', function (req, res) {
	var search = req.params.date
  var nasaUrl = 'https://api.nasa.gov/planetary/apod?date=' + search + '&api_key=MzEpv1NTalvTmOMPnsTOrIlkKIR5njkiDLK5p5L3';
  request(nasaUrl, function(error, response, body) {
    var space = JSON.parse(body);
    res.send(space);
  });
});

// PARALLAX PAGE WHERE THEY CAN VIEW NASA'S PHOTOS WITH STYLE
app.get('/parallax', function(req, res) {
	var user = req.user;
	res.render('parallax', {user: user});
})

// PROFILE PAGE
app.get('/profile', isLoggedIn, function(req, res) {
  var user = req.user;
  res.render('profile', {user: user});
});

app.use('/auth', require('./controllers/auth'));

// LISTEN 
var server = app.listen(process.env.PORT || 3000);

module.exports = server;