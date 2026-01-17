import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PMDashboard from './pages/PMDashboard';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Recruitment from './pages/Recruitment';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import './index.css';

function App() {
  return (
    <NextUIProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pm/*"
                element={
                  <ProtectedRoute allowedRoles={['pm']}>
                    <PMDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/*"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <HRDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee/*"
                element={
                  <ProtectedRoute allowedRoles={['employee', 'pm', 'hr']}>
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/*"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <TaskDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute>
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees/:id"
                element={
                  <ProtectedRoute>
                    <EmployeeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruitment"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'hr', 'pm']}>
                    <Recruitment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaves"
                element={
                  <ProtectedRoute>
                    <Leaves />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'hr', 'pm']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}

export default App;
