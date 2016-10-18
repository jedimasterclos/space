// REQUIRE 
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var request = require('request');

// require('dotenv').config();

// GLOBAL VARIABLES
var app = express();


// ANY USE OR SET STATEMENTS THAT WE NEED
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

// DEFINE ROUTES/PATHS
app.get('/', function(req, res) {
	res.render('index')
});

app.get('/apod', function(req, res) {
	res.render('apod');
});

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

// LISTEN 
app.listen(3000);