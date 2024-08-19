// src/components/CSVExport.js
import React from 'react';
import { CSVLink } from 'react-csv';
import { useLanguage } from './LanguageContext';
import { Button } from '@mui/material';

const CSVExport = ({ transactions, sx }) => {
  const { currentTranslations } = useLanguage();

  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
    { label: 'Type', key: 'type' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
  ];

  return (
    <Button
      variant="contained"
      sx={{
        ...sx,
        borderRadius: 1,
        backgroundColor: '#4CAF50', // Light green background
        color: 'white', // Text color
        '&:hover': {
          backgroundColor: '#76c776', // Darker shade of green on hover
        },
      }}
    >
      <CSVLink
        data={transactions}
        headers={headers}
        filename="transactions.csv"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {currentTranslations.exportCSV}
      </CSVLink>
    </Button>
  );
};

export default CSVExport;
