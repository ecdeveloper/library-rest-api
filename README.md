A RESTful API server for a library
===

This server is created with Node.js, Express and MongoDB. It could be implemented with a relational DB (as mentioned below), but for the sake of fast development and due to no data relationships - MongoDB has been chosen. 

### Assumptions
* Each book is unique. No multiple books with the same name exist in the system.
* When reserving a book, a person's name must be provided.
* When checking out a book, a person's name must be provided.
* A book can be checked out only if it was not reserved OR if it was reserved by that same person (look up by name)

### Potential improvements
* Have users registered in the system, so reserving/checking out actions can be tied to real user ids, instead of plain text names
* Use an RDBMS, thus all relationships between users and books they reserved/checked out can be stored as separate entities (in separate tables, related to books/users tables via foreign keys)
* Add logging
* Add unit/integration tests

### System Requirements
* Node.js version `6.*` or higher
* MongoDB version `3.*` or higher

### Usage
Installing dependencies:

```shell
npm install
```

Before starting the server, make sure you seed the database with some books:

```shell
cd utils
node seed-db
```

*Note: DB seed script will not cleanup the DB prior to seeding. So if you run it multiple times, it will duplicate the books which are already in DB.*

Starting the server:

```shell
# make sure you are in the root project directory
npm start
```

## API

There are 4 API endpoints, defined below. Using `POST` for checking in/out and reserving is not really a RESTful approach in this current implementation. `POST` requests are supposed to be creating a new entity, whereas we are updating the `book` document in DB (thus a PATCH request would be more appropriate in this case). However, eventually, I would slightly re-design the backend, so each checkin/reservation are actual entities (relationships between users and books). In that case `POST` would be a legitimate method for checkin/checkout/reserve operations, since it would be creating those relationships.

#### GET /search/:bookTitle

Searches all books, which match the bookTitle. Expects a book title to be passed as GET param.

#### example request

    $ curl http://localhost:3000/search/house

#### response

    {
      "status":200,
      "books":[
        {
           "_id":"5a065dc8b15c0666543c0df4",
           "name":"Thanks, Obama: My Hopey, Changey White House Years",
           "author":"David Litt"
        },
        {
           "_id":"5a065dc8b15c0666543c0df8",
           "name":"The Golden House",
           "author":"Salman Rushdie"
        },
        {
           "_id":"5a065dc8b15c0666543c0e15",
           "name":"Who Thought This Was a Good Idea?: And Other Questions You Should Have Answers to When You Work in the White House",
           "author":"Alyssa Mastromonaco"
        }
      ]
    }

#### POST /book/:bookId/checkOut

Checks out a book. Expects a book id to be passed as GET param, and a userName as body.

#### example request
    $ curl http://localhost:3000/book/<book_mongo_id>/checkout -X POST --data 'userName=John Doe'

#### response
    {
      "status": 200,
      "message": "The book was checked out"
    }

#### POST /book/:bookId/checkIn

Checks in a book. Expects a book id to be passed as GET param.

#### example request
    $ curl http://localhost:3000/book/<book_mongo_id>/checkin -X POST

#### response
    {
      "status": 200,
      "message": "The book was checked in"
    }
    

#### POST /book/:bookId/reserve

Reserves a book. Expects a book id to be passed as GET param, and a userName as body.

#### example request
    $ curl http://localhost:3000/book/<book_mongo_id>/reserve -X POST --data 'userName=John Doe'

#### response
    {
      "status": 200,
      "message": "The book was checked out"
    }