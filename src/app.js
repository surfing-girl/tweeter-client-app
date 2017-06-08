'use strict';
const express = require('express');
const TwitterData = require('./twitterData.js');
const app = express();
const bodyParser = require('body-parser');

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');



app.get('/', (req, res) => {
  const twitterData = new TwitterData();
  twitterData.createFinalData((gotData) => {
    res.render('index', {dataList: gotData});
  });
  // let name = dummyData.name;
  // res.render('index', {dummyData: arguments[0]});
  console.log("hellooo");
});

app.post('/', (req, res, next) => {
  //console.log(req.body.twitText);
  if (req.body.twitText) {
    const twitterData = new TwitterData();
    twitterData.sendTwit(req.body.twitText);
    twitterData.createFinalData((gotData) => {
      res.render('index', {dataList: gotData});
    });
  } else {
    let err = new Error('All fields require');
    err.status = 440;
    return next(err);
  }
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
