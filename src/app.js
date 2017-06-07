'use strict';
const express = require('express');
const TwitterData = require('./twitterData.js');
const app = express();
const dummyData = {
  name: 'Joanna',
  age: 23,
  date: new Date(),
  town: 'London'
}

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

const twitterData = new TwitterData();

app.get('/', (req, res) => {
  //twitterData.createFinalData(res);
  twitterData.createFinalData((gotData) => {
    console.log("gotData", gotData);
    res.render('index', {dummyData: gotData});
  });
  // let name = dummyData.name;
  // res.render('index', {dummyData: arguments[0]});
  console.log("hellooo");
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
