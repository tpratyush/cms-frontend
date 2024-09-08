import React from 'react';

   const ClaimTable = ({ claims }) => (
     <div className="table-responsive">
       <h2>Claim History</h2>
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
         <tbody>
           {claims.length === 0 ? (
             <tr><td colSpan="5">No claims found</td></tr>
           ) : (
             claims.map(claim => (
               <tr key={claim.claimId}>
                 <td>{claim.claimId}</td>
                 <td>{claim.policyName}</td>
                 <td>${claim.claimAmount}</td>
                 <td>{new Date(claim.claimDate).toLocaleDateString()}</td>
                 <td>Approved</td>
               </tr>
             ))
           )}
         </tbody>
       </table>
     </div>
   );

   export default ClaimTable;