'use strict';

const express = require('express');
const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
