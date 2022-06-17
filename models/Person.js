const mongoose = require('mongoose');

const Person = mongoose.model('Person', {
  name: String,
  role: String,
  age: Number,
  active: Boolean,
});

module.exports = Person;