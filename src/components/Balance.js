// src/components/Balance.js
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { FaBars } from 'react-icons/fa'; // Import the hamburger icon
import StyledIconWrapper from './StyledIconWrapper'; // Import the styled wrapper
import { toast } from 'react-toastify'; // Import toast notifications

const Balance = ({ transactions, initialCapital, updateInitialCapital, budgetLimit, setBudgetLimit }) => {
  const { currentTranslations } = useLanguage();
  const [newBalance, setNewBalance] = useState(initialCapital);
  const [newBudgetLimit, setNewBudgetLimit] = useState(budgetLimit); // State to track budget limit input
  const [showUpdateSection, setShowUpdateSection] = useState(false); // State to toggle the update section
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'Income'
      ? acc + transaction.amount
      : transaction.type === 'Expense'
      ? acc - transaction.amount
      : acc; // 'Other' transactions don't affect the balance
  }, newBalance);

  const totalExpenses = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((total, t) => total + t.amount, 0);

  if (totalExpenses > budgetLimit) {
    toast.error(currentTranslations.budgetExceeded);
  }

  const handleBalanceChange = (e) => {
    setNewBalance(parseFloat(e.target.value));
  };

  const handleBudgetLimitChange = (e) => {
    setNewBudgetLimit(parseFloat(e.target.value));
  };

  const updateBalanceAndBudget = () => {
    updateInitialCapital(newBalance);
    setBudgetLimit(newBudgetLimit);
  };

  // Calculate the percentage of the budget used
  const budgetUsedPercentage = Math.min((totalExpenses / budgetLimit) * 100, 100);

  // Toggle the visibility of the update section
  const toggleUpdateSection = () => {
    setShowUpdateSection((prev) => !prev);
  };

  // Determine the color based on the balance value
  const balanceColor = isNaN(balance) || balance === 0 ? 'white' : balance > 0 ? 'green' : 'red';

  return (
    <Card sx={{ mb: 3, position: 'sticky', top: 0, zIndex: 1000 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant={isMobile ? 'h6' : 'h5'} component="h5" gutterBottom>
            {currentTranslations.currentBalance}: <span style={{ fontWeight: 'bold', color: balanceColor }}>₪{isNaN(balance) ? '0.00' : balance.toFixed(2)}</span>
          </Typography>
          <IconButton onClick={toggleUpdateSection} sx={{ ml: 2, mt: isMobile ? -0.5 : 0 }}>
            <StyledIconWrapper>
              <FaBars />
            </StyledIconWrapper>
          </IconButton>
        </Box>
        {/* Progress bar indicating budget usage */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {currentTranslations.budgetLimit}: ₪{budgetLimit.toFixed(2)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={budgetUsedPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: budgetUsedPercentage > 90 ? 'red' : 'primary.main',
              },
            }}
          />
          <Typography variant="body2" color="textSecondary" align="right">
            {budgetUsedPercentage.toFixed(0)}% used
          </Typography>
        </Box>
        {showUpdateSection && (
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2, // Add some margin-top for spacing
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              type="number"
              label={currentTranslations.setNewBalance}
              value={newBalance}
              onChange={handleBalanceChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              type="number"
              label={currentTranslations.budgetLimit}
              value={newBudgetLimit}
              onChange={handleBudgetLimitChange}
              fullWidth
              size={isMobile ? 'small' : 'medium'}
            />
            <Button variant="outlined" onClick={updateBalanceAndBudget} size={isMobile ? 'small' : 'medium'}>
              {currentTranslations.updateBalance}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Balance;
