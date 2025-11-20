# MERN Airline Reservation System

A full-stack airline reservation system built with MongoDB, Express, React, and Node.js. Features user authentication, flight management, seat selection, booking system, and email confirmations.

## Features

### User Features
- **Registration & Login**: Secure user authentication with JWT tokens
- **Browse Flights**: View available flights with search and filter options
- **Seat Selection**: Interactive seat map to choose specific seats
- **Booking System**: Complete booking flow with passenger details and payment
- **My Bookings**: View all bookings with status, seat numbers, and flight details
- **Email Receipts**: Automatic email confirmation with booking details

### Admin Features
- **Admin Dashboard**: Comprehensive dashboard with statistics
- **Flight Management**: Create, update, and delete flights
- **Booking Management**: View all bookings, filter by status, cancel bookings
- **User Management**: View all registered users
- **Seat Map Configuration**: Configure seat layouts for each flight

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, React Router, Axios, Vite
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Email**: Nodemailer (Gmail SMTP)
- **Database**: MongoDB Atlas

## Prerequisites

- Node.js (v20.19+ or v22.12+)
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password for email functionality

## Installation

### 1. Clone the repository

```bash
cd C:\pr1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:password@cluster0.eh88qnu.mongodb.net/airline?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=super-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=eswarvenky931@gmail.com
SMTP_PASS=osnw xjyy kpfw cdcv
SMTP_FROM=AirLine <eswarvenky931@gmail.com>
```

**Note**: Replace the MongoDB password and update SMTP credentials if needed.

### 3. Seed Admin User

```bash
npm run seed:admin
```

This creates the admin user with:
- **Email**: `2200032881cseh@gmail.com`
- **Password**: `V@nky2003`

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user/admin
- `GET /api/auth/me` - Get current user (protected)

### Flights
- `GET /api/flights` - Get all flights (with optional query params)
- `GET /api/flights/:id` - Get single flight with seat map
- `POST /api/flights` - Create flight (admin only)
- `PUT /api/flights/:id` - Update flight (admin only)
- `DELETE /api/flights/:id` - Delete flight (admin only)
- `POST /api/flights/:id/seat-map` - Update seat map (admin only)
- `POST /api/flights/seed` - Seed sample flights (admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings (or all for admin)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users (Admin Only)
- `GET /api/users` - Get all users

## User Flow

1. **Registration/Login**
   - New users register with name, email, and password
   - Existing users login with email and password
   - Admin uses: `2200032881cseh@gmail.com` / `V@nky2003`

2. **Browse Flights** (User Dashboard)
   - View all available flights
   - Search by origin, destination, or date
   - See flight details: price, available seats, times

3. **Book Flight**
   - Select a flight
   - Choose seats from interactive seat map
   - Enter passenger details (name, email, contact)
   - Enter payment information
   - Confirm booking

4. **Email Confirmation**
   - Receipt email sent automatically with:
     - Flight details
     - Seat numbers
     - Payment reference
     - Booking status

5. **View Bookings**
   - See all bookings in "My Bookings" section
   - View booking status, seat numbers, flight details
   - Cancel bookings if needed

## Admin Flow

1. **Login as Admin**
   - Use admin credentials to access admin dashboard

2. **Manage Flights**
   - Create new flights with:
     - Flight number, origin, destination
     - Departure/arrival times
     - Price, total seats
     - Seat map configuration
   - Edit or delete existing flights

3. **View All Bookings**
   - See all user bookings
   - Filter by status (CONFIRMED, CANCELLED)
   - View booking details and cancel if needed

4. **View Users**
   - See all registered users
   - View user statistics

## Project Structure

```
pr1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   └── flightController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Booking.js
│   │   │   ├── Flight.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   └── flightRoutes.js
│   │   ├── scripts/
│   │   │   └── seedAdmin.js
│   │   ├── utils/
│   │   │   └── email.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── bookings.js
│   │   │   ├── client.js
│   │   │   └── flights.js
│   │   ├── components/
│   │   │   ├── AdminBookingTable.jsx
│   │   │   ├── AdminFlightForm.jsx
│   │   │   ├── AppShell.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── BookingList.jsx
│   │   │   ├── FlightCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SeatPicker.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   └── TravelerDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - Email address for sending emails
- `SMTP_PASS` - Email app password
- `SMTP_FROM` - From address for emails

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes (admin/user separation)
- Input validation on backend
- CORS configuration

## Email Configuration

The system uses Gmail SMTP. To set up:

1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords
3. Use the app password in `SMTP_PASS` environment variable

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP

### Email Not Sending
- Verify SMTP credentials
- Check Gmail app password is correct
- Ensure 2-Step Verification is enabled

### Frontend Build Errors
- Ensure Node.js version is 20.19+ or 22.12+
- Delete `node_modules` and reinstall: `npm install`

## License

ISC
