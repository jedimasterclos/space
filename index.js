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
	res.render('index', {user: user});
});

app.get('/about', function(req, res) {
	var user = req.user;
	res.render('about', {user: user});
});

app.get('/gallery', function(req, res) {
	var user = req.user;
	res.render('gallery', {user: user});
});

app.get('/apod', function(req, res) {
	var user = req.user;
	res.render('apod', {user: user});
});

app.get('/parallax', function(req, res) {
	var user = req.user;
	res.render('parallax', {user: user});
})

app.get('/nasaimg/:date', function (req, res) {
	console.log(req.params);
	var search = req.params.date
  var nasaUrl = 'https://api.nasa.gov/planetary/apod?date=' + search + '&api_key=MzEpv1NTalvTmOMPnsTOrIlkKIR5njkiDLK5p5L3';
  request(nasaUrl, function(error, response, body) {
  	console.log(body);
    var space = JSON.parse(body);
    res.send(space);
  });
});

app.get('/profile', isLoggedIn, function(req, res) {
  var user = req.user;
  res.render('profile', {user: user});
});

app.use('/auth', require('./controllers/auth'));

// LISTEN 
var server = app.listen(process.env.PORT || 3000);

module.exports = server;