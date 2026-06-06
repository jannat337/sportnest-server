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

const facilitySchema = new mongoose.Schema({
  name: String,
  facility_type: String,
  image: String,
  location: String,
  price_per_hour: Number,
  capacity: Number,
  available_slots: String,
  description: String,
  owner_email: String,
  booking_count: { type: Number, default: 0 }
})

const Facility = mongoose.model('Facility', facilitySchema)

const bookingSchema = new mongoose.Schema({
  facility_id: String,
  facility_name: String,
  user_email: String,
  booking_date: String,
  time_slot: String,
  hours: Number,
  total_price: Number,
  status: { type: String, default: 'pending' }
})

const Booking = mongoose.model('Booking', bookingSchema)

// Routes
app.get('/', (req, res) => {
  res.send('SportNest Server is running!')
})

// Get all facilities
app.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facility.find()
    res.json(facilities)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add facility
app.post('/facilities', async (req, res) => {
  try {
    const facility = new Facility(req.body)
    const result = await facility.save()
    res.json({ insertedId: result._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single facility
app.get('/facilities/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id)
    res.json(facility)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update facility
app.put('/facilities/:id', async (req, res) => {
  try {
    const result = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete facility
app.delete('/facilities/:id', async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id)
    res.json({ deletedCount: 1 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add booking
app.post('/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body)
    const result = await booking.save()
    res.json({ insertedId: result._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get bookings by user email
app.get('/bookings', async (req, res) => {
  try {
    const email = req.query.email
    const bookings = await Booking.find({ user_email: email })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Cancel booking
app.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ deletedCount: 1 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`SportNest server running on port ${port}`)
})