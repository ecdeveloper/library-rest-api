'use strict';

const { validationResult } = require('express-validator/check');
const booksManager = require('../../lib/books-manager');

/**
 * Book check out handler
 */
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

  // Check the book out by id, to a specific user name
  booksManager.checkOutById(bookId, req.body.userName)
    .then(success => {
      // Book check out failed
      if (!success) {
        return res.json({
          status: 404,
          message: 'No book with such id was found or the book is already reserved/checked out'
        });
      }

      return res.json({
        status: 200,
        message: 'The book was checked out'
      });
    })
    .catch(exc => res.status(400).json({
      status: 400,
      message: exc.message
    }));
}