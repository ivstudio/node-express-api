const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const books = require('./routes/bookRouter');

if (process.env.ENV === 'Test') {
	console.log('test');
	mongoose.connect('mongodb://localhost/bookAPI_test');
} else {
	mongoose.connect('mongodb://localhost/bookAPI');
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/books', books);

const port = process.env.PORT || 3000;

app.server = app.listen(port, () => {
	console.log(`app listening on ${port}`);
});

module.exports = app;
