# SportNest Server

## Description
This is the backend server for SportNest - a sports facility booking platform built with Node.js, Express, and MongoDB.

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- Cookie Parser
- CORS
- dotenv

## API Endpoints

### Auth
- POST /jwt - Generate JWT token
- POST /logout - Clear JWT token

### Facilities
- GET /facilities - Get all facilities (with search and filter)
- GET /facilities/:id - Get single facility
- POST /facilities - Add new facility (protected)
- PUT /facilities/:id - Update facility (protected)
- DELETE /facilities/:id - Delete facility (protected)

### Bookings
- GET /bookings - Get user bookings (protected)
- POST /bookings - Add new booking (protected)
- DELETE /bookings/:id - Cancel booking (protected)

## Environment Variables
- PORT
- MONGODB_URI
- JWT_SECRET