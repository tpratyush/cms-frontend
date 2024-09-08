import React from 'react';
   import { Link } from 'react-router-dom';

   const Sidebar = ({ onLogout }) => (
     <div id="sidebar">
       <header>
         <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: 900 }}>Dashboard</Link>
       </header>
       <ul className="nav">
         <li><Link to="/dashboard/policies"><i className="zmdi zmdi-view-dashboard"></i> Policies</Link></li>
         <li><Link to="/dashboard/account"><i className="zmdi zmdi-link"></i> Account</Link></li>
         <li><Link to="/dashboard/claims"><i className="zmdi zmdi-widgets"></i> Claims</Link></li>
         <li><button onClick={onLogout} className="logout-btn">
           <i className="zmdi zmdi-lock"></i> Logout
         </button></li>
       </ul>
     </div>
   );

   export default Sidebar;