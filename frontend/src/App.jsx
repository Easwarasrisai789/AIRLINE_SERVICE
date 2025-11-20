import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'

// Admin pages
import AdminHome from './pages/admin/AdminHome'
import AdminFlights from './pages/admin/AdminFlights'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminManual from './pages/admin/AdminManual'
import AdminProfile from './pages/admin/AdminProfile'

// User pages
import UserFlights from './pages/user/UserFlights'
import SelectSeats from './pages/user/SelectSeats'
import Payment from './pages/user/Payment'
import UserBookings from './pages/user/UserBookings'
import UserProfile from './pages/user/UserProfile'

import './App.css'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* User Routes */}
        <Route
          path="/traveler"
          element={
            <ProtectedRoute roles={['traveler', 'admin']}>
              <UserFlights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/traveler/select-seats"
          element={
            <ProtectedRoute roles={['traveler', 'admin']}>
              <SelectSeats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/traveler/payment"
          element={
            <ProtectedRoute roles={['traveler', 'admin']}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/traveler/bookings"
          element={
            <ProtectedRoute roles={['traveler', 'admin']}>
              <UserBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/traveler/profile"
          element={
            <ProtectedRoute roles={['traveler', 'admin']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/flights"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminFlights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manual"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminManual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App
