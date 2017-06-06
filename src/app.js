'use strict';
const express = require('express');
const app = express();
const dummyData = {
  name: 'Joanna',
  age: 23,
  town: 'London'
}

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', (req, res) => {
  let name = dummyData.name;
  res.render('index', {dummyData: dummyData});
  console.log("hellooo");
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
