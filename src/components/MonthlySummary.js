import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { Card, CardHeader, CardContent, Typography, Box, Collapse, IconButton } from '@mui/material';
import { FaArrowUp, FaArrowDown, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Import Material-UI icons
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MovieIcon from '@mui/icons-material/Movie';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Map categories to icons
const categoryIcons = {
  food: <FastfoodIcon />,
  rent: <HomeIcon />,
  utilities: <LocalGasStationIcon />,
  entertainment: <MovieIcon />,
  transport: <LocalGasStationIcon />,
  health: <HealthAndSafetyIcon />,
  misc: <MoreHorizIcon />,
  salary: <AttachMoneyIcon />,
  bonus: <AttachMoneyIcon />,
  other: <MoreHorizIcon />,
  shopping: <ShoppingCartIcon />,
  education: <SchoolIcon />,
  travel: <FlightIcon />,
  bills: <ReceiptIcon />,
};

const MonthlySummary = ({ transactions }) => {
  const { currentTranslations } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  // Calculate the summary of transactions for each month
  const summary = transactions.reduce((acc, transaction) => {
    const monthIndex = new Date(transaction.date).getMonth();
    const month = currentTranslations.months[monthIndex];

    if (!acc[month]) acc[month] = { income: 0, expense: 0, categories: {} };
    const amount = parseFloat(transaction.amount) || 0;

    if (transaction.type === 'Income') {
      acc[month].income += amount;
    } else {
      acc[month].expense += amount;
    }

    if (!acc[month].categories[transaction.category]) {
      acc[month].categories[transaction.category] = 0;
    }
    acc[month].categories[transaction.category] += amount;

    return acc;
  }, {});

  return (
    <Card sx={{ mt: 4 }}>
      <CardHeader
        title={currentTranslations.monthlySummary}
        onClick={handleToggle}
        action={
          <IconButton onClick={handleToggle}>
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </IconButton>
        }
        sx={{ cursor: 'pointer' }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {Object.keys(summary).map((month) => {
            const { income, expense, categories } = summary[month];
            const currentBalance = income - expense;

            return (
              <Box key={month} mb={3}>
                <Typography variant="h6">{month}</Typography>
                {Object.entries(categories).map(([category, amount]) => (
                  <Typography key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      {categoryIcons[category] || <MoreHorizIcon />}
                    </Box>
                    {currentTranslations.categories[category]}: ₪{amount.toFixed(2)}
                  </Typography>
                ))}
                <Typography sx={{ display: 'flex', alignItems: 'center', color: 'green', mb: 1 }}>
                  <FaArrowUp style={{ marginRight: 8 }} />
                  {currentTranslations.income}: ₪{income.toFixed(2)}
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', color: 'red', mb: 1 }}>
                  <FaArrowDown style={{ marginRight: 8 }} />
                  {currentTranslations.expenses}: ₪{expense.toFixed(2)}
                </Typography>
                <Typography color={currentBalance > 0 ? 'green' : currentBalance < 0 ? 'red' : 'text.primary'}>
                  {currentTranslations.currentBalance}: ₪{currentBalance.toFixed(2)}
                </Typography>
              </Box>
            );
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default MonthlySummary;
