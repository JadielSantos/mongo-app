const router = require('express').Router();
const Person = require('../models/Person');

// CREATE - Create Person
router.post('/', async (req, res) => {
  const person = new Person(req.body);

  // Person validation
  if (!person.name) {
    res.status(422).json({ error: 'Bad request: name is required' });
    return;
  }

  // Save person on database
  await person
    .save()
    .then(() => res.status(201).json({ message: 'Person created!', person }))
    .catch((err) => res.status(500).json({ error: err }));
});

// READ - Get all persons
router.get('/', async (req, res) => {
  await Person.find()
    .then((persons) => res.status(200).json(persons))
    .catch((err) => res.status(500).json({ error: err }));
});

// READ - Get person by id
router.get('/:id', async (req, res) => {
  await Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        res.status(404).json({ error: 'Person not found' });
        return;
      }

      res.status(200).json(person);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// UPDATE - Update person by id
router.patch('/:id', async (req, res) => {
  await Person.updateOne({ _id: req.params.id }, req.body)
    .then((updatedPerson) => {
      if (updatedPerson.matchedCount === 0) {
        res.status(404).json({ error: 'Person not found' });
        return;
      }
      res.status(200).json({ message: 'Person updated!', person: req.body });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// DELETE - Delete person by id
router.delete('/:id', async (req, res) => {
  await Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      if (!person) {
        res.status(404).json({ error: 'Person not found' });
        return;
      }

      res.status(200).json({ message: 'Person deleted!', person });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
