import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { themeChange } from 'theme-change'

//contexts
import MainLayout from './contexts/MainLayout';

//pages
// Pages
import Login from './pages/Login';
import ForgotPage from './pages/Forgot';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactsPage from './pages/ContactsPage';
import ChatDetailsPage from './pages/ChatDetailsPage';
import EmployeeManagementPage from './pages/Employee-manage';
import NewJobPage from './pages/New-Job';
import HrNewJob from './pages/New-job-man';
import JobAppMan from './pages/Job-app-man';


import './index.css';

// App.jsx
function App() {
    useEffect(() => { themeChange(false) }, [])

    return (
        <Router>
            <Routes>
                {/* PUBLIC ROUTES (No Sidebar) */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot" element={<ForgotPage />} />

                {/* PRIVATE ROUTES (Inside Sidebar) */}
                <Route element={<MainLayout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/settings/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/chat/:id" element={<ChatDetailsPage />} />
                    <Route path="/employee-manage" element={<EmployeeManagementPage />} />
                    <Route path="/new-job" element={<NewJobPage />} />
                    <Route path="/new-job-man" element={<HrNewJob />} />
                    <Route path="/job-app-man/:id" element={<JobAppMan />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Route>
            </Routes>
        </Router>
    );
}
export default App;
