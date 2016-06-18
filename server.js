// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors       = require('cors');
console.log(cors);
app.use(cors());
var router = express.Router();

var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("227V8R", "65716e5ed2ccbdc602c7d5d3233060e7");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(allowCrossDomain);

app.use('/api', router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', './view')
app.set('view engine', 'pug');

var port = process.env.PORT || 8080;        // set our port
var globalObject;
// ROUTES FOR OUR API
// =============================================================================
// var router = express.Router();              // get an instance of the express Router

router.get("/authorize", function (req, res, next) {
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:8080/api/callback'));
});

router.get("/callback", function (req, res, next) {
    console.log(req.query.code);
    client.getAccessToken(req.query.code, 'http://localhost:8080/api/callback').then(function (result) {
      console.log(result);
      console.log("after")
        client.get("/profile.json", result.access_token).then(function (results) {
            console.log(results);
            res.set('Content-Type', 'text/html');
            var tempObject = results[0];






            res.render('index2', { title: 'Hey', message: JSON.stringify(results[0].user)});
            //res.json(JSON.stringify(results[0].user));
        });
    }).catch(function (error) {
        res.json(error);
    });
});


app.get('/', function(req, res, next) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('App listening on port ' + port);
