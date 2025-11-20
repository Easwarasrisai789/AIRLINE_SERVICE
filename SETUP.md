# Quick Setup Guide

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
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

Seed admin user:
```bash
npm run seed:admin
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 4. Login Credentials

**Admin:**
- Email: `2200032881cseh@gmail.com`
- Password: `V@nky2003`

**User:**
- Register a new account from the login page

## First Steps

1. **Login as Admin** to access admin dashboard
2. **Create Flights** using the "Add Flight" form
3. **Logout** and register/login as a regular user
4. **Browse Flights** and make a booking
5. **Check Email** for booking confirmation

## Troubleshooting

- **MongoDB Connection Error**: Verify the MongoDB URI and password in `.env`
- **Email Not Sending**: Check SMTP credentials and ensure Gmail app password is correct
- **Port Already in Use**: Change PORT in `.env` or kill the process using the port

