// InventoryList.js
import React from 'react';
import InventoryItem from './InventoryItem';

function InventoryList({ inventory }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Spent</th>
          <th>Expiry Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map(item => (
          <InventoryItem key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  );
}

export default InventoryList;
