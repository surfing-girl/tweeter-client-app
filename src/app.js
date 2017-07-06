'use strict';
const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io').listen(server);
const TwitterData = require('./twitterData.js');
const bodyParser = require('body-parser');
const config = require('./config.js');

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

//Get the index page and render data into template
app.get('/', (req, res) => {
  const twitterData = new TwitterData(config);
  twitterData.createFinalData((gotData) => {
    res.render('index', {dataList: gotData});
  });
});

//Display an error page
app.get('/error', (req, res) => {
  res.render('error', {message: req.query.message});
});

//Post tweet on Tweeter
app.post('/', (req, res, next) => {
  if (req.body.twitText) {
    const twitterData = new TwitterData(config);
    twitterData.sendTwit(req.body.twitText);
    twitterData.createFinalData((gotData) => {
      res.redirect('/');
    });
  } else {
    res.redirect('/error?message=Posting_field_is_required');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

let twee = io.of('tweet');

const streamTweet = new TwitterData(config);
streamTweet.streamData(io);

console.log("The frontend server is running on port 3000!");
