import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Policies from './components/Policies'; // Import the Policies component
import Account from './components/Account'; // Import the Account component
import Claim from './components/Claim'; // Import the Claims component

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Policies />
            </PrivateRoute>
          } 
        /> */}
        <Route 
          path="/dashboard/policies" 
          element={
            <PrivateRoute>
              <Policies />  {/* Add Policies route */}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/account" 
          element={
            <PrivateRoute>
              <Account />  {/* Add Account route */}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/claims" 
          element={
            <PrivateRoute>
              <Claim />  {/* Add Claims route */}
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
