'use strict';

const { validationResult } = require('express-validator/check');
const booksManager = require('../../lib/books-manager');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  const { bookTitle } = req.params;

  // Check request validation errors
  if (!errors.isEmpty()) {
    const errObj = errors.array()[0];

    return res.status(422).json({
      status: 422,
      message: errObj.msg,
      param: errObj.param
    });
  }

  // Search for the book here
  booksManager.findBookByTitle(bookTitle)
    .then(results => {
      // Some fields on the book object have to be omitted
      // We don't want to expose personal info as names, for those who reserved and/or checked out a book
      return res.json({
        status: 200,
        books: results.map(item => {
          delete item.reserved;
          delete item.checkedOut;
          return item;
        })
      })
    })
    .catch(exc => res.status(400).json({
      status: 400,
      message: exc.message
    }));
}