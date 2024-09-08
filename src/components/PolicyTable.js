import React from 'react';

   const PolicyTable = ({ policies, onRemovePolicy }) => (
     <div className="table-responsive">
       <h2>Your Policies</h2>
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
           {policies.length === 0 ? (
             <tr><td colSpan="4">No policies assigned</td></tr>
           ) : (
             policies.map(policy => (
               <tr key={policy.policyId}>
                 <td>{policy.policyName}</td>
                 <td>${policy.policyAmount}</td>
                 <td>{new Date(policy.policyExpiryDate).toLocaleDateString()}</td>
                 <td>
                   <button onClick={() => onRemovePolicy(policy.policyId)}>Remove</button>
                 </td>
               </tr>
             ))
           )}
         </tbody>
       </table>
     </div>
   );

   export default PolicyTable;