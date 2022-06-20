const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  role: String,
  age: Number,
  active: Boolean,
});

personSchema.methods.listTasksAssignedTo =
  async function listTasksAssignedTo() {
    return this.model('Task')
      .find({ assignedTo: this._id })
      .populate('createdBy')
      .populate('assignedTo')
      .then((tasks) => {
        if (!tasks.length) {
          return null;
        } else {
          return tasks;
        }
      })
      .catch((err) => {
        return err;
      });
  };

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
