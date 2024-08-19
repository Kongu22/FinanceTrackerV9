// src/components/AddTransactionForm.js
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import { FaPlus, FaBars, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import StyledIconWrapper from './StyledIconWrapper';

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

const AddTransactionForm = ({ addTransaction, setFilterCriteria }) => {
  const { currentTranslations } = useLanguage();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('food');
  const [showFilters, setShowFilters] = useState(false);

  // State for recurring transactions
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState('');
  const [recurringStartDate, setRecurringStartDate] = useState('');
  const [recurringEndDate, setRecurringEndDate] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const transaction = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      isRecurring,
      recurringDay: isRecurring ? parseInt(recurringDay, 10) : null,
      recurringStartDate: isRecurring ? recurringStartDate : null,
      recurringEndDate: isRecurring ? recurringEndDate : null,
    };

    addTransaction(transaction);

    // Reset form fields
    setDescription('');
    setAmount('');
    setCategory('food');
    setIsRecurring(false);
    setRecurringDay('');
    setRecurringStartDate('');
    setRecurringEndDate('');
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant={isMobile ? 'h6' : 'h5'} component="h5" gutterBottom>
            {currentTranslations.addTransaction}
          </Typography>
          <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ ml: 2, mt: -2 }}>
            <StyledIconWrapper>
              <FaBars />
            </StyledIconWrapper>
          </IconButton>
        </Box>
        {showFilters && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              {currentTranslations.filter || 'Filter'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={currentTranslations.date}
                  type="date"
                  fullWidth
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={currentTranslations.date}
                  type="date"
                  fullWidth
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  label={currentTranslations.category}
                  value={category}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StyledIconWrapper>{categoryIcons[selected]}</StyledIconWrapper>
                      <Box sx={{ ml: 1 }}>{currentTranslations.categories[selected]}</Box>
                    </Box>
                  )}
                >
                  <MenuItem value="">{currentTranslations.allCategories}</MenuItem>
                  {Object.keys(currentTranslations.categories).map((key) => (
                    <MenuItem key={key} value={key}>
                      <StyledIconWrapper>{categoryIcons[key]}</StyledIconWrapper>
                      <Box sx={{ ml: 1 }}>{currentTranslations.categories[key]}</Box>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  label={currentTranslations.type}
                  value={type}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  fullWidth
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StyledIconWrapper>
                        {selected === 'Income' ? <FaArrowUp color="green" /> : <FaArrowDown color="red" />}
                      </StyledIconWrapper>
                      <Box sx={{ ml: 1 }}>
                        {selected === 'Income' ? currentTranslations.income : currentTranslations.expenses}
                      </Box>
                    </Box>
                  )}
                >
                  <MenuItem value="">{currentTranslations.allTypes}</MenuItem>
                  <MenuItem value="Income">
                    <StyledIconWrapper>
                      <FaArrowUp color="green" />
                    </StyledIconWrapper>
                    <Box sx={{ ml: 1 }}>{currentTranslations.income}</Box>
                  </MenuItem>
                  <MenuItem value="Expense">
                    <StyledIconWrapper>
                      <FaArrowDown color="red" />
                    </StyledIconWrapper>
                    <Box sx={{ ml: 1 }}>{currentTranslations.expenses}</Box>
                  </MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={currentTranslations.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={currentTranslations.amount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                type="number"
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label={currentTranslations.type}
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StyledIconWrapper>
                      {selected === 'Income' ? <FaArrowUp color="green" /> : <FaArrowDown color="red" />}
                    </StyledIconWrapper>
                    <Box sx={{ ml: 1 }}>
                      {selected === 'Income' ? currentTranslations.income : currentTranslations.expenses}
                    </Box>
                  </Box>
                )}
              >
                <MenuItem value="Income">
                  <StyledIconWrapper>
                    <FaArrowUp color="green" />
                  </StyledIconWrapper>
                  <Box sx={{ ml: 1 }}>{currentTranslations.income}</Box>
                </MenuItem>
                <MenuItem value="Expense">
                  <StyledIconWrapper>
                    <FaArrowDown color="red" />
                  </StyledIconWrapper>
                  <Box sx={{ ml: 1 }}>{currentTranslations.expenses}</Box>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label={currentTranslations.category}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StyledIconWrapper>{categoryIcons[selected]}</StyledIconWrapper>
                    <Box sx={{ ml: 1 }}>{currentTranslations.categories[selected]}</Box>
                  </Box>
                )}
              >
                {Object.keys(currentTranslations.categories).map((key) => (
                  <MenuItem key={key} value={key}>
                    <StyledIconWrapper>{categoryIcons[key]}</StyledIconWrapper>
                    <Box sx={{ ml: 1 }}>{currentTranslations.categories[key]}</Box>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                }
                label={currentTranslations.recurringCheckboxLabel}
              />
            </Grid>
            {isRecurring && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={recurringStartDate}
                    onChange={(e) => setRecurringStartDate(e.target.value)}
                    fullWidth
                    size={isMobile ? 'small' : 'medium'}
                    InputLabelProps={{ shrink: true }}
                    helperText="Select the start date for the recurring transaction"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Recurring Day"
                    type="number"
                    value={recurringDay}
                    onChange={(e) => setRecurringDay(e.target.value)}
                    fullWidth
                    size={isMobile ? 'small' : 'medium'}
                    helperText="Enter the day of the month for the recurring transaction"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={recurringEndDate}
                    onChange={(e) => setRecurringEndDate(e.target.value)}
                    fullWidth
                    size={isMobile ? 'small' : 'medium'}
                    InputLabelProps={{ shrink: true }}
                    helperText="Select the end date for the recurring transaction"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  padding: isMobile ? '10px 0' : '14px 0',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              >
                <FaPlus className="mr-2" />
                {currentTranslations.addTransaction}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
