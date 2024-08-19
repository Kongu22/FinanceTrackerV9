// src/components/IncomeExpenseChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeExpenseChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const calculateMonthlyTotals = (type) => {
      const monthlyTotals = Array(12).fill(0);

      transactions.forEach((transaction) => {
        const month = new Date(transaction.date).getMonth();
        if (transaction.type === type) {
          monthlyTotals[month] += transaction.amount;
        }
      });

      return monthlyTotals;
    };

    const incomeData = calculateMonthlyTotals('Income');
    const expenseData = calculateMonthlyTotals('Expense');

    setChartData({
      labels: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      datasets: [
        {
          label: 'Income',
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          data: incomeData,
          barPercentage: 0.5,
          categoryPercentage: 0.8
        },
        {
          label: 'Expenses',
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          data: expenseData,
          barPercentage: 0.5,
          categoryPercentage: 0.8
        }
      ]
    });
  }, [transactions]);

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="w-100" style={{ height: '90vh' }}>
      <h3 className="text-center">Monthly Overview</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default IncomeExpenseChart;
