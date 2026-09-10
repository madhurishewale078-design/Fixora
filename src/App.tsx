import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { AIAssistant } from './pages/AIAssistant';
import { Services } from './pages/Services';
import { Technicians } from './pages/Technicians';
import { TechnicianDetail } from './pages/TechnicianDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TechnicianRegister } from './pages/TechnicianRegister';
import { ForgotPassword } from './pages/ForgotPassword';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/services" element={<Services />} />
                <Route path="/technicians" element={<Technicians />} />
                <Route path="/technicians/:id" element={<TechnicianDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/technician" element={<TechnicianRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Role-Protected Customer Route */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Role-Protected Technician Route */}
                <Route
                  path="/technician/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                      <TechnicianDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Role-Protected Admin Route */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Authenticated Profile Route */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
