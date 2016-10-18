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
  if(req.params.date) {

  };
  var search = req.params.date
  var nasaUrl = 'https://api.nasa.gov/planetary/apod?date=' + search + '&api_key=MzEpv1NTalvTmOMPnsTOrIlkKIR5njkiDLK5p5L3';
  

  request(nasaUrl, function(error, response, body) {
    var space = JSON.parse(body).results;
    res.render('index', { space: space });
  });
});

app.get('/apod', function(req, res) {
	res.render('apod');
})

// LISTEN 
app.listen(3000);