const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.log('MongoDB error:', err));

app.get('/', (req, res) => {
  res.send('SportNest Server is running!');
});

app.listen(port, () => {
  console.log(`SportNest server running on port ${port}`);
});