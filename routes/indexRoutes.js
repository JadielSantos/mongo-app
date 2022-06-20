const router = require('express').Router();
const mongoose = require('mongoose');

// READ - Get all Collections
router.get('/', async (req, res) => {
    await mongoose.connection.db.listCollections()
        .toArray()
        .then((collections) => res.status(200).json(collections))
        .catch((err) => res.status(500).json({ error: err }));
    }
);

module.exports = router;