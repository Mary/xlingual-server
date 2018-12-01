'use strict';

const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');

const Word = require('../models/wordModel');
const User = require('../models/userModel');

const {
  words,
  users
} = require('../dummydata/dummydata');

console.log(`Connecting to mongodb at ${TEST_DATABASE_URL}`);
mongoose.connect(TEST_DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.info('Delete Data');
    return Promise.all([
      Word.deleteMany(),
      User.deleteMany(),
    ]);
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Word.insertMany(words),
      User.insertMany(users)
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
