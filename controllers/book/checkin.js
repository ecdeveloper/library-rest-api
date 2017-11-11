'use strict';

const { validationResult } = require('express-validator/check');
const booksManager = require('../../lib/books-manager');

/**
 * Book check in handler
 */
module.exports = (req, res) => {
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

  // Check the book in by id
  booksManager.checkInById(bookId)
    .then(success => {
      // Book check in failed
      if (!success) {
        return res.json({
          status: 404,
          message: 'No book with such id is checked out'
        });
      }

      return res.json({
        status: 200,
        message: 'The book was checked in'
      });
    })
    .catch(exc => res.status(400).json({
      status: 400,
      message: exc.message
    }));
}