'use strict';

const mongo = require('../lib/mongo');
const books = require('./data/books');

mongo.getDb().then(db => {
  db.collection('books').insertMany(books, err => {
    if (err) throw err;
    
    console.log('DB was seeded');
    process.exit(0);
  });
});