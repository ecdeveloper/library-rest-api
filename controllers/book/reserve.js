'use strict';

const { validationResult } = require('express-validator/check');
const booksManager = require('../../lib/books-manager');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  const { bookId } = req.params;

  // Check request validation errors
  if (!errors.isEmpty()) {
    const errObj = errors.array()[0];

    return res.status(422).json({
      status: 422,
      message: errObj.msg,
      param: errObj.param
    });
  }

  // Reserve the book by id, for a specific user name
  booksManager.reserveById(bookId, req.body.userName)
    .then(reserved => {
      if (!reserved) {
        return res.json({
          status: 404,
          message: 'No book with such id was found or the book is already reserved/checked out'
        });
      }
      
      return res.json({
        status: 200,
        message: 'The book was reserved'
      });
    })
    .catch(exc => res.status(400).json({
      status: 400,
      message: exc.message
    }));
}