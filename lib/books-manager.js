'use strict';

const mongo = require('./mongo');

module.exports = {
  findBookByTitle: title => {
    return mongo.getDb().then(db => {
      const findObj = {
        name: {
          '$regex': title,
          '$options': 'i'
        }
      };
      
      return db.collection('books').find(findObj).toArray();
    });
  },
  
  reserveById: (id, userName) => {
    return mongo.getDb().then(db => {
      const updateCondition = {
        _id: mongo.ObjectID(id),
        reserved: null,
        checkedOut: null
      };
      
      const updateObj = {
        '$set': {
          reserved: {
            date: new Date(),
            user: userName
          }
        }
      };

      return db.collection('books').updateOneAsync(updateCondition, updateObj).then(data => data && data.modifiedCount === 1);
    });
  },
  
  checkOutById: (id, userName) => {
    // Update the book document only when either one of the following conditions is satisfied:
    // 1. book should not be reserved or checked out
    // 2. book may be reserved by that same user name
    return mongo.getDb().then(db => {
      let updateCondition = {
        _id: mongo.ObjectID(id),
        '$or': [{
          'reserved.user': userName
        }, {
          '$and': [{ checkedOut: null, reserved: null }]
        }]
      };
      
      const updateObj = {
        '$set': {
          checkedOut: {
            date: new Date(),
            user: userName
          },
          reserved: null
        }
      };

      return db.collection('books').updateOneAsync(updateCondition, updateObj).then(data => data && data.modifiedCount === 1);
    });
  },
  
  checkInById: (id) => {
    return mongo.getDb().then(db => {
      let updateCondition = {
        _id: mongo.ObjectID(id),
        checkedOut: { '$exists': true }
      };
      
      const updateObj = {
        '$set': {
          checkedOut: null
        }
      };

      return db.collection('books').updateOneAsync(updateCondition, updateObj).then(data => data && data.modifiedCount === 1);
    });
  }
};