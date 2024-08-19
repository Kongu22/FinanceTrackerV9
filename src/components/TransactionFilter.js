// src/components/TransactionFilter.js
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { TextField, Select, MenuItem, Button, Card, CardHeader, CardContent, IconButton } from '@mui/material';

const TransactionFilter = ({ setFilterCriteria }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const handleFilter = () => {
    setFilterCriteria({ startDate, endDate, category, type });
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader
        action={
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <FaBars />
          </IconButton>
        }
        title="Filter Transactions"
      />
      {showFilters && (
        <CardContent>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {/* Map categories here */}
          </Select>
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
          <Button variant="contained" color="primary" fullWidth onClick={handleFilter}>
            Apply Filters
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default TransactionFilter;
