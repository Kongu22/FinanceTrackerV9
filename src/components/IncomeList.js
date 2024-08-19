// src/components/IncomeList.js
import React from 'react';

const IncomeList = () => {
  return (
    <div className="card mt-4">
      <div className="card-header bg-success text-white">
        <h2>Income</h2>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Example Income 1: $1000</li>
        <li className="list-group-item">Example Income 2: $500</li>
      </ul>
    </div>
  );
};

export default IncomeList;
