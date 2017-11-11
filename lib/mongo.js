'use strict';

/*
  A MongoDB library. Serves as a singleton for a MongoDB client object. 
*/

const Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
const Collection = require('mongodb').Collection;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config');
let db = null;

Promise.promisifyAll(Collection.prototype);
Promise.promisifyAll(MongoClient);

module.exports = {
  ObjectID,
  getDb: () => {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);

      MongoClient.connect(`mongodb://${config.db.host}/${config.db.name}`)
        .then(db1 => {
          db = db1;
          resolve(db);
        })
        .catch(err => {
          throw err
        });
    });
  }
}
