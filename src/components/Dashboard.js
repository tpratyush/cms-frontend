import React, { useState, useEffect } from 'react';
   import { useNavigate, Routes, Route } from 'react-router-dom';
   import axios from 'axios';
   import Sidebar from './Sidebar';
   import PolicyTable from './PolicyTable';
   import ClaimTable from './ClaimTable';
   import '../styles/Dashboard.css'; 
   const Dashboard = () => {
     const [policies, setPolicies] = useState([]);
     const [claims, setClaims] = useState([]);
     const navigate = useNavigate();

     useEffect(() => {
       fetchUserPolicies();
       fetchUserClaims();
     }, []);

     const getToken = () => localStorage.getItem('token');

     const fetchUserPolicies = async () => {
       try {
         const response = await axios.post('/api/policies/user-policies', {
           userId: getUserIdFromToken(getToken())
         }, {
           headers: { Authorization: `Bearer ${getToken()}` }
         });
         setPolicies(response.data);
       } catch (error) {
         console.error('Error fetching policies:', error);
       }
     };

     const fetchUserClaims = async () => {
       try {
         const response = await axios.get('/api/claims/user-claims', {
           headers: { Authorization: `Bearer ${getToken()}` }
         });
         setClaims(response.data.claims || []);
       } catch (error) {
         console.error('Error fetching claims:', error);
       }
     };

     const removePolicy = async (policyId) => {
       try {
         await axios.post('/api/policies/remove', {
           policyId,
           userId: getUserIdFromToken(getToken())
         }, {
           headers: { Authorization: `Bearer ${getToken()}` }
         });
         alert('Policy removed successfully!');
         fetchUserPolicies();
       } catch (error) {
         console.error('Error removing policy:', error);
         alert('An error occurred. Please try again.');
       }
     };

     const logout = async () => {
       try {
         await axios.post('/user/logout', {}, {
           headers: { Authorization: `Bearer ${getToken()}` }
         });
         localStorage.removeItem('token');
         navigate('/');
       } catch (error) {
         console.error('Error during logout:', error);
         alert('An error occurred while logging out. Please try again.');
       }
     };

     // Helper function to parse JWT and get user ID
     const getUserIdFromToken = (token) => {
       // Implementation remains the same as before
     };

     return (
       <div id="viewport">
         <Sidebar onLogout={logout} />
         <div id="content">
           <div className="container-fluid">
             <h1>Account</h1>
             <Routes>
               <Route path="policies" element={<PolicyTable policies={policies} onRemovePolicy={removePolicy} />} />
               <Route path="claims" element={<ClaimTable claims={claims} />} />
               <Route path="*" element={<PolicyTable policies={policies} onRemovePolicy={removePolicy} />} />
             </Routes>
           </div>
         </div>
       </div>
     );
   };

   export default Dashboard;