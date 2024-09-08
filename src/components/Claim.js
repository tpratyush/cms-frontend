import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'; // Import the CSS file for styling

const Claim = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token');

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
        return JSON.parse(jsonPayload);
    };

    const getUserIdFromToken = (token) => {
        try {
            const decoded = parseJwt(token);
            return decoded.id; // Adjust based on your token payload structure
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const fetchUserClaims = async () => {
        const token = getToken();
        const userId = getUserIdFromToken(token);

        if (!token || !userId) {
            alert('User not logged in');
            return;
        }

        try {
            const response = await fetch('/api/policies/user-policies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch policies');
            }

            const policies = await response.json();
            console.log('Policies:', policies);
            setClaims(policies.filter(policy => policy.policyAmount > 0)); // Filter policies with amount > 0
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const claimPolicy = async (policyId, claimAmount) => {
        const token = getToken();
        const userId = getUserIdFromToken(token);

        if (!token || !userId) {
            alert('User not logged in');
            return;
        }

        if (!claimAmount || isNaN(claimAmount) || claimAmount <= 0) {
            alert('Please enter a valid claim amount');
            return;
        }

        try {
            const response = await fetch('/api/claims/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ policyId, userId, claimAmount: parseFloat(claimAmount) }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchUserClaims(); // Refetch the list of policies
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const logout = async () => {
        const token = getToken();
        try {
            const response = await fetch('/user/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'same-origin'
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

    useEffect(() => {
        fetchUserClaims();
    }, []);

    return (
        <div id="viewport">
            {/* Sidebar */}
            <div id="sidebar">
                <header>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 900 }}>Dashboard</a>
                </header>
                <ul className="nav">
                    <li><a href="/dashboard/policies"><i className="zmdi zmdi-view-dashboard"></i> Policies</a></li>
                    <li><a href="/dashboard/account"><i className="zmdi zmdi-link"></i> Account</a></li>
                    <li><a href="/dashboard/claims"><i className="zmdi zmdi-widgets"></i> Claims</a></li>
                    <li>
                        <button onClick={logout} >
                            <i className="zmdi zmdi-lock"></i> Logout
                        </button>
                    </li>
                </ul>
            </div>
            {/* Content */}
            <div id="content">
                <div className="container-fluid">
                    <h1>Claim Policy</h1>
                    {/* Claims Table */}
                    <div className="table-responsive">
                        <table id="claim-table">
                            <thead>
                                <tr>
                                    <th>Policy Name</th>
                                    <th>Policy Amount</th>
                                    <th>Expiry Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4">Loading...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan="4">{error}</td></tr>
                                ) : (
                                    claims.map((policy) => (
                                        <tr key={policy.policyId._id}>
                                            <td>{policy.policyName}</td>
                                            <td>$<span id={`policy-amount-${policy.policyId._id}`}>{policy.policyAmount}</span></td>
                                            <td>{new Date(policy.policyExpiryDate).toLocaleDateString()}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    id={`claim-amount-${policy.policyId._id}`}
                                                    placeholder="Enter amount"
                                                    min="1"
                                                />
                                                <button onClick={() => {
                                                    const claimAmount = document.getElementById(`claim-amount-${policy.policyId._id}`).value;
                                                    claimPolicy(policy.policyId._id, claimAmount);
                                                }}>Claim</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Claim;
