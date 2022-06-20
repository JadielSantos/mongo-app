const router = require('express').Router();
const Task = require('../models/Task');
const Person = require('../models/Person');

// CREATE - Create Task
router.post('/', async (req, res) => {
  const people = req.body.assignedTo;
  // Remove people array from req.body
  delete req.body.assignedTo;
  const task = new Task(req.body);

  // Task validation
  if (!task.title) {
    res.status(422).json({ error: 'Bad request: title is required' });
    return;
  }

  await Promise.all(people.map(async (person) => {
    await Person.findById(person)
      .then((person) => {
        if (!person || !person.active) {
          res.status(404).json({ error: 'Person not found' });
          return;
        }
        task.assignedTo.push(person);
      })
      .catch((err) => res.status(500).json({ error: err }));
  }));

  await Person.find()
    .limit(1)
    .then((person) => {
      if (!person) {
        res.status(404).json({
          error: 'There must be at least ONE Person before creating a Task',
        });
        return;
      }

      task.createdBy = person[0]._id;
    })
    .catch((err) => res.status(500).json({ error: err }));

  task.createdAt = new Date(Date.now());

  // Save task on database
  await task
    .save()
    .then(() => res.status(201).json({ message: 'Task created!', task }))
    .catch((err) => res.status(500).json({ error: err }));
});

// READ - Get all tasks
router.get('/', async (req, res) => {
  await Task.find()
    .populate('createdBy')
    .populate('assignedTo')
    .then((tasks) => res.status(200).json(tasks))
    .catch((err) => res.status(500).json({ error: err }));
});

// READ - Get task by id
router.get('/:id', async (req, res) => {
  await Task.findById(req.params.id)
    .populate('createdBy')
    .populate('assignedTo')
    .then((task) => {
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// UPDATE - Update task by id
router.patch('/:id', async (req, res) => {
  if (req.body.completed) {
    req.body.completedAt = new Date(Date.now());
  }

  await Task.updateOne({ _id: req.params.id }, req.body)
    .then((updatedTask) => {
      if (updatedTask.matchedCount === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.status(200).json({ message: 'Task updated!', task: req.body });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// DELETE - Delete task by id
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
    .then((task) => {
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json({ message: 'Task deleted!', task });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
