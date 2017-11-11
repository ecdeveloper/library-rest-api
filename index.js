'use strict';

/*
  Design an automated librarian service that provides:
    - “lookup a book title”
    - “checkout a book”
    - “checkin book”
    - “reserve book”
  functionality

  Design and implement a REST server supporting these features.
  Use your past experience at libraries as a guide in the level of details you deem appropriate for this project.

  Please spend no more than 3 hours on your solution.

  Include instructions on how to run your project, assumptions you made during the design, and improvements you would like to make if you have more time.

  For bonus points, create a front-end application for the service.
*/

const express = require('express');
const app = express();
const { check } = require('express-validator/check');
const bodyParser = require('body-parser');

const config  = require('./config');
const booksManager = require('./lib/books-manager');

// Actions / controllers
const bookSearch = require('./controllers/book/search');
const bookCheckIn = require('./controllers/book/checkin');
const bookCheckOut = require('./controllers/book/checkout');
const bookReserve = require('./controllers/book/reserve');

// Request middleware validators
const checkTitle = check('bookTitle').trim().isLength({ min: 1, max: 100 });
const checkUserName = check('userName').trim().isLength({ min: 2, max: 100 });
const checkId = check('bookId').trim().exists().custom(value => {
	const mongoIdRegex = new RegExp('^[0-9a-fA-F]{24}$');
	return mongoIdRegex.test(value);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Defining routes
app.get('/search/:bookTitle', [ checkTitle ], bookSearch);
app.post('/book/:bookId/checkIn', [ checkId ], bookCheckIn);
app.post('/book/:bookId/checkOut', [ checkId, checkUserName ], bookCheckOut);
app.post('/book/:bookId/reserve', [ checkId, checkUserName ], bookReserve);

const port = process.env.PORT || config.server.port || 3000;

app.listen(port);
console.log(`Server started on port ${port}`);