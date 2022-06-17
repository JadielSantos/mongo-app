const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
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

module.exports = Task;
