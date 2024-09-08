import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css'; // Make sure to import your CSS

const Account = () => {
    const [policies, setPolicies] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loadingPolicies, setLoadingPolicies] = useState(true);
    const [loadingClaims, setLoadingClaims] = useState(true);

    useEffect(() => {
        fetchUserPolicies();
        fetchUserClaims();
    }, []);

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

    const fetchUserPolicies = async () => {
        const token = getToken();
        const userId = getUserIdFromToken(token);

        if (!token || !userId) {
            console.error('User not logged in');
            return;
        }

        try {
            const response = await fetch(`/api/policies/user-policies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "userId": userId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to fetch policies:', errorData.message);
                return;
            }

            const data = await response.json();
            setPolicies(data);
            setLoadingPolicies(false);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    const fetchUserClaims = async () => {
        const token = getToken();
        const userId = getUserIdFromToken(token);

        if (!token || !userId) {
            console.error('User not logged in');
            return;
        }

        try {
            const response = await fetch('/api/claims/user-claims', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to fetch claims:', errorData.message);
                return;
            }

            const data = await response.json();
            setClaims(data.claims || []);
            setLoadingClaims(false);
        } catch (error) {
            console.error('Error fetching claims:', error);
        }
    };

    const removePolicy = async (policyId) => {
        const token = getToken();
        const userId = getUserIdFromToken(token);

        if (!token || !userId) {
            console.error('User not logged in');
            return;
        }

        try {
            const response = await fetch('/api/policies/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "policyId": policyId, "userId": userId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to remove policy.');
                return;
            }

            alert('Policy removed successfully!');
            fetchUserPolicies(); // Refresh the policy list
        } catch (error) {
            console.error('Error removing policy:', error);
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
                        <button id="logoutButton"  onClick={logout}>
                            <i className="zmdi zmdi-lock"></i> Logout
                        </button>
                    </li>
                </ul>
            </div>
            {/* Content */}
            <div id="content">
                <div className="container-fluid">
                    <h1>Account</h1>

                    {/* Policies Table */}
                    <h2>Your Policies</h2>
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
                            <tbody id="policy-list">
                                {loadingPolicies ? (
                                    <tr><td colSpan="4">Loading policies...</td></tr>
                                ) : (
                                    policies.length > 0 ? (
                                        policies.map(policy => (
                                            <tr key={policy.policyId}>
                                                <td>{policy.policyName}</td>
                                                <td>${policy.policyAmount}</td>
                                                <td>{new Date(policy.policyExpiryDate).toLocaleDateString()}</td>
                                                <td>
                                                    <button onClick={() => removePolicy(policy.policyId)}>Remove</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4">No policies assigned</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Claim History Table */}
                    <h2>Claim History</h2>
                    <div className="table-responsive">
                        <table id="claim-table">
                            <thead>
                                <tr>
                                    <th>Claim ID</th>
                                    <th>Policy Name</th>
                                    <th>Claim Amount</th>
                                    <th>Claim Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="claim-list">
                                {loadingClaims ? (
                                    <tr><td colSpan="5">Loading claims...</td></tr>
                                ) : (
                                    claims.length > 0 ? (
                                        claims.map(claim => (
                                            <tr key={claim.claimId}>
                                                <td>{claim.claimId}</td>
                                                <td>{claim.policyName}</td>
                                                <td>${claim.claimAmount}</td>
                                                <td>{new Date(claim.claimDate).toLocaleDateString()}</td>
                                                <td>Approved</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5">No claims found</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
