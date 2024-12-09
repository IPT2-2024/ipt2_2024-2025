import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './../public/dashboard/components/Header';
import SideBar from './../public/dashboard/components/SideBar';
import UserLogin from '../public/loginportal/UserLoginPage';
import PrivateRoute from './PrivateRouter';  // Import your PrivateRoute

import Dashboard from '../public/dashboard/DashboardPage';
import Profile from '../public/profile/ProfilePage';
import User from '../public/user/UserPage';
import FacultyIS from '../public/faculty/FacultyISPage';
import StudentIS from '../public/student/StudentISPage';
import ClassSchedulings from '../public/classscheduling/ClassSchedulingPage';
import AcademicPrograms from '../public/academicprograms/AcademicProgramsPage';
import SubjectEnlistments from '../public/subjectenlistment/SubjectEnlistmentPage';
import EnlistmentManagers from '../public/enlistmentmanager/EnlistmentManagerPage';
import ClassroomManagers from '../public/classroommanager/ClassroomManagerPage';

import FacilitiesManagerManagement from '../public/systemsettings/facilitiesmanagement/FacilitiesManagerManagementPage';
import ProgramsManagerManagement from './../public/systemsettings/programsmanager/ProgramsManagerManagementPage'
import PostingManagement from './../public/systemsettings/postingmanagement/PostingManagementPage';
import TermsManagement from '../public/systemsettings/termsmanagement/TermsManagementPage';

import EmptyPage from './EmptyPage';
const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token'); // Check if the token exists
};

export default function Routers() {
  const [userRole, setUserRole] = React.useState(localStorage.getItem('user_role') || ''); // Get user role from localStorage if it exists

  React.useEffect(() => {
    // Ensure that the role is correctly updated in localStorage and state after login
    const role = localStorage.getItem('user_role');
    if (role && role !== userRole) {
      setUserRole(role);
    }
  }, [userRole]); // Empty dependency array ensures this runs once when the component mounts

  const isLoggedIn = isAuthenticated();

  return (
    <Router>
      <Routes>
        {/* Redirect to the proper dashboard based on the user role */}
        <Route path="/" element={isLoggedIn ? <Navigate to={`/${userRole}/dashboard`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/${userRole}/dashboard`} /> : <UserLogin setUserRole={setUserRole} />} />
        
        {/* Protected Routes */}
        <Route path="/superadmin/dashboard" element={<PrivateRoute roleRequired="superadmin"><Dashboard /></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute roleRequired="admin"><Dashboard /></PrivateRoute>} />
        
        {/* Role-based Routes */}
        <Route path="/:role/users" element={<PrivateRoute roleRequired={['superadmin']}><User /></PrivateRoute>} />
        <Route path="/:role/manage-account" element={<PrivateRoute roleRequired={[ 'admin','superadmin']}><Profile /></PrivateRoute>} />
        <Route path="/:role/faculty-is" element={<PrivateRoute roleRequired={['superadmin']}><FacultyIS /></PrivateRoute>} />
        <Route path="/:role/student-is" element={<PrivateRoute roleRequired={['superadmin']}><StudentIS /></PrivateRoute>} />
        <Route path="/:role/class-scheduling" element={<PrivateRoute roleRequired={['superadmin']}><ClassSchedulings /></PrivateRoute>} />
        <Route path="/:role/academic-programs" element={<PrivateRoute roleRequired={['superadmin']}><AcademicPrograms /></PrivateRoute>} />
        <Route path="/:role/subject-enlistment" element={<PrivateRoute roleRequired={['superadmin']}><SubjectEnlistments /></PrivateRoute>} />
        <Route path="/:role/enlistment-manager" element={<PrivateRoute roleRequired={['admin', 'superadmin']}><EnlistmentManagers /></PrivateRoute>} />
        <Route path="/:role/classroom-manager" element={<PrivateRoute roleRequired={['superadmin']}><ClassroomManagers /></PrivateRoute>} />

        {/* Superadmin-only routes */}
        <Route path="/system-settings/facilities-manager" element={<PrivateRoute roleRequired={['superadmin']}><FacilitiesManagerManagement /></PrivateRoute>} />

        <Route path="/system-settings/posting-management" element={<PrivateRoute roleRequired={['superadmin']}><PostingManagement /></PrivateRoute>} />
        <Route path="/system-settings/programs-management" element={<PrivateRoute roleRequired={['superadmin']}><ProgramsManagerManagement /></PrivateRoute>} />
        <Route path="/system-settings/terms-management" element={<PrivateRoute roleRequired={['superadmin']}><TermsManagement /></PrivateRoute>} />
        
        {/* Header and Sidebar Routes */}
        <Route path="/header" element={<Header />} />
        <Route path="/sidebar" element={<SideBar userRole={userRole} />} />
        <Route path="*" element={<EmptyPage />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Routers />);
