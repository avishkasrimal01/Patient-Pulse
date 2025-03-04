const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // To parse JSON data from requests

// Connect to MongoDB
mongoose.connect('mongodb+srv://anrdsgit:npn123@cluster0.zploe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Define the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Patient Pulse API');
});

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
