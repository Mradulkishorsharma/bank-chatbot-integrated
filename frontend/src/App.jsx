import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/login.jsx';
import Register from './auth/Register.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import IntentEntityRecognizer from './components/IntentEntityRecognizer.jsx';
import useAuthStore from './store/authStore.jsx';

function App() {
  const { token, role } = useAuthStore();

  // Single declaration only - removed duplicates
  const Protected = ({ children }) => token ? children : <Navigate to="/login" replace />;
  const AdminOnly = ({ children }) => token && role === 'admin' ? children : <Navigate to="/login" replace />;
  const UserOnly = ({ children }) => {
  if (!token) {
      return <Navigate to="/login" replace />;
    }
  if (role !== 'user') {
    return <Navigate to="/dashboard" replace />; // Or wherever non-users should go
  }
  return children;
};

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!token ? <Login /> : (role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />)} />
      <Route path="/register" element={!token ? <Register /> : (role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />)} />

      {/* Protected User Routes */}
      <Route 
        path="/dashboard" 
        element={
          <UserOnly>
            <UserDashboard />
          </UserOnly>
        } 
      />
      
      <Route
  path="/chat"
  element={
    <UserOnly>
      <ChatWindow />
    </UserOnly>
  }
/>

      
      <Route 
        path="/intent" 
        element={
          <UserOnly>
            <IntentEntityRecognizer />
          </UserOnly>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminOnly>
            <AdminDashboard />
          </AdminOnly>
        } 
      />

      <Route 
        path="/admin/*" 
        element={
          <AdminOnly>
            <AdminDashboard />
          </AdminOnly>
        } 
      />

      {/* Default redirects */}
      <Route path="/" element={!token ? <Navigate to="/login" /> : (
        role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />
      )} />
      
      <Route path="*" element={!token ? <Navigate to="/login" /> : (
        role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />
      )} />
    </Routes>
  );
}

export default App;
