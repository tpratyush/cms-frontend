import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'; // Assuming your styles are in a separate CSS file

const Policies = () => {
  const [policies, setPolicies] = useState([]);

  // Fetch policies when the component is mounted
  useEffect(() => {
    fetchPolicies();
  }, []);

  // Function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Function to parse JWT token
  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
  };

  // Function to extract user ID from token
  const getUserIdFromToken = (token) => {
    try {
      const decoded = parseJwt(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Fetch policies from the API
  const fetchPolicies = async () => {
    const token = getToken();
    if (!token) {
      alert('User not logged in');
      return;
    }

    try {
      const response = await fetch('/api/policies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch policies');
      }

      const data = await response.json();
      setPolicies(data); // Set policies in state
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Add policy for the user
  const addPolicy = async (policyId) => {
    const token = getToken();
    const userId = getUserIdFromToken(token);

    if (!userId) {
      alert('Unable to get user ID from token');
      return;
    }

    try {
      const response = await fetch('/api/policies/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ policyId, userId }),
      });

      if (response.ok) {
        alert('Policy Purchased successfully!');
        fetchPolicies(); // Refresh the policy list
      } else {
        const result = await response.json();
        alert(result.message || 'Error adding policy');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      const response = await fetch('/user/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        credentials: 'same-origin',
      });

      if (response.ok) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        console.error('Logout failed');
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <div id="viewport">
      {/* Sidebar */}
      <div id="sidebar">
        <header>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 900 }}>Dashboard</a>
        </header>
        <ul className="nav">
          <li><a href="/dashboard/policies">Policies</a></li>
          <li><a href="/dashboard/account">Account</a></li>
          <li><a href="/dashboard/claims">Claims</a></li>
          <li><button id="logoutButton" onClick={logout}>Logout</button></li>
        </ul>
      </div>

      {/* Content */}
      <div id="content">
        <div className="container-fluid">
          <h1>Policies</h1>

          {/* Policies Table */}
          <div className="table-responsive">
            <table id="policy-table">
              <thead>
                <tr>
                  <th>Policy Name</th>
                  <th>Policy Amount</th>
                  <th>Expiry Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy._id}>
                    <td>{policy.policyName}</td>
                    <td>{`$${policy.policyAmount.toFixed(2)}`}</td>
                    <td>{new Date(policy.policyExpiryDate).toLocaleDateString()}</td>
                    <td><button onClick={() => addPolicy(policy._id)}>Purchase</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
