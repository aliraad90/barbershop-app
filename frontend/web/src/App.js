import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import ServiceDetails from './pages/Services/ServiceDetails';
import Barbers from './pages/Barbers/Barbers';
import BarberDetails from './pages/Barbers/BarberDetails';
import Appointments from './pages/Appointments/Appointments';
import BookAppointment from './pages/Appointments/BookAppointment';
import AppointmentDetails from './pages/Appointments/AppointmentDetails';
import Reviews from './pages/Reviews/Reviews';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';
import NotFound from './pages/NotFound/NotFound';

// Import i18n
import './i18n/i18n';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <GlobalStyles />
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:id" element={<ServiceDetails />} />
                    <Route path="barbers" element={<Barbers />} />
                    <Route path="barbers/:id" element={<BarberDetails />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                  </Route>

                  {/* Protected Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route path="appointments" element={
                      <ProtectedRoute>
                        <Appointments />
                      </ProtectedRoute>
                    } />
                    <Route path="appointments/book" element={
                      <ProtectedRoute>
                        <BookAppointment />
                      </ProtectedRoute>
                    } />
                    <Route path="appointments/:id" element={
                      <ProtectedRoute>
                        <AppointmentDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;