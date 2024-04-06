// InventoryItem.js
import React from 'react';

function InventoryItem({ item }) {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.amount}</td>
      <td>{item.spent}</td>
      <td>{item.expiryDate}</td>
      <td>{item.status}</td>
      <td>
        {/* Render your delete and three-dots menu icon here */}
      </td>
    </tr>
  );
}

export default InventoryItem;
