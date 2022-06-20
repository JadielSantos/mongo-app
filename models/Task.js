const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  dueDate: Date,
  priority: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
  createdAt: Date,
  completedAt: Date,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
