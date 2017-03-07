const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/environment');
mongoose.connect(dbURI);

const User = require('../models/user');
const Dive = require('../models/dive');

User.collection.drop();
Dive.collection.drop();

User
  .create([{
    username: 'adrianwelch',
    email: 'adriancwelch@gmail.com',
    password: 'password',
    passwordConfirmation: 'password'
  }])
  .then((users) => {
    console.log(`${users.length} users created!`);

    return Dive
      .create([{
        diveNo: 1,
        date: '2017-01-14',
        diveTime: 45,
        diveSite: 'Cairns',
        location: 'Great Barrier Reef',
        diveShop: 'Oz Dive Shop',
        animalTags: 'White tip Shark, Sea Turtle',
        stars: 5,
        review: 'Great Dive',
        images: '',
        createdBy: users[0]
      }]);
  })
  .then((dives) => {
    console.log(`${dives.length} dives created!`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
