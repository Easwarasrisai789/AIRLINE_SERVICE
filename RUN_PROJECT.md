# How to Run the Complete Project

## Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account (or local MongoDB)

## Step 1: Backend Setup

### Navigate to backend directory
```bash
cd backend
```

### Install dependencies
```bash
npm install
```

### Create `.env` file in backend directory
Create a file named `.env` in the `backend` folder with the following content:

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

**Note:** Replace the MongoDB password with your actual MongoDB Atlas password.

### Seed Admin User (First time only)
```bash
npm run seed:admin
```

This creates the admin user:
- **Email**: `2200032881cseh@gmail.com`
- **Password**: `V@nky2003`

### Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

## Step 2: Frontend Setup

### Open a NEW terminal window

### Navigate to frontend directory
```bash
cd frontend
```

### Install dependencies
```bash
npm install
```

### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## Step 3: Access the Application

### Open your browser and go to:
```
http://localhost:5173
```

### Login Credentials:

**Admin:**
- Email: `2200032881cseh@gmail.com`
- Password: `V@nky2003`

**User:**
- Register a new account from the login page

---

## Quick Start Commands (Summary)

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run seed:admin    # First time only
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Troubleshooting

### Backend won't start:
- Check if MongoDB connection string is correct in `.env`
- Make sure port 5000 is not already in use
- Check if all dependencies are installed: `npm install`

### Frontend won't start:
- Check if port 5173 is not already in use
- Make sure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Manual fetch error:
- The manual will be automatically created on first access
- Make sure backend is running and MongoDB is connected

### Can't login:
- Make sure you ran `npm run seed:admin` in the backend directory
- Check if backend server is running on port 5000

---

## Production Build

### Build Frontend:
```bash
cd frontend
npm run build
```

### Start Backend in Production:
```bash
cd backend
npm start
```

---

## Project Structure

```
pr1/
├── backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
│
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api/
    │   └── App.jsx
    └── package.json
```

---

## Features

✅ User Authentication (Login/Register)
✅ Admin Dashboard
✅ Flight Management
✅ Seat Selection
✅ Booking System
✅ Payment Processing (Card & UPI QR)
✅ User Profile Management
✅ Email Notifications
✅ Real-time Seat Availability

---

## Support

If you encounter any issues:
1. Check that both servers are running
2. Verify MongoDB connection
3. Check browser console for errors
4. Check terminal output for backend errors

