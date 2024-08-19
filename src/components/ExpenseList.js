// src/components/ExpenseList.js
import React from 'react';

const ExpenseList = () => {
  return (
    <div className="card mt-4">
      <div className="card-header bg-danger text-white">
        <h2>Expenses</h2>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Example Expense 1: $200</li>
        <li className="list-group-item">Example Expense 2: $100</li>
      </ul>
    </div>
  );
};

export default ExpenseList;
