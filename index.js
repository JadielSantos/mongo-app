// Initial config
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Read JSON file / middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API routes
const indexRoutes = require('./routes/indexRoutes');
const personRoutes = require('./routes/personRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/', indexRoutes);
app.use('/api/person', personRoutes);
app.use('/api/task', taskRoutes);

// Connect to MongoDB and start server
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.tefmz.mongodb.net/apidatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000);
  })
  .catch((err) => console.log(err));
