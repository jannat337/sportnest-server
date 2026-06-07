const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://sportnest-client-ecru.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' })
    req.user = decoded
    next()
  })
}

app.post('/jwt', (req, res) => {
  const user = req.body
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }).json({ success: true })
})

app.post('/logout', (req, res) => {
  res.clearCookie('token').json({ success: true })
})

app.get('/', (req, res) => {
  res.send('SportNest Server is running!')
})

// Get all facilities with search and filter ($regex, $in)
app.get('/facilities', async (req, res) => {
  try {
    const { search, type } = req.query
    let query = {}

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    if (type) {
      query.facility_type = { $in: [type] }
    }

    const facilities = await Facility.find(query)
    res.json(facilities)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/facilities', verifyToken, async (req, res) => {
  try {
    const facility = new Facility(req.body)
    const result = await facility.save()
    res.json({ insertedId: result._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/facilities/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id)
    res.json(facility)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/facilities/:id', verifyToken, async (req, res) => {
  try {
    const result = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/facilities/:id', verifyToken, async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id)
    res.json({ deletedCount: 1 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/bookings', verifyToken, async (req, res) => {
  try {
    const booking = new Booking(req.body)
    const result = await booking.save()
    res.json({ insertedId: result._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/bookings', verifyToken, async (req, res) => {
  try {
    const email = req.query.email
    if (req.user.email !== email) return res.status(403).json({ message: 'Forbidden' })
    const bookings = await Booking.find({ user_email: email })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/bookings/:id', verifyToken, async (req, res) => {
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