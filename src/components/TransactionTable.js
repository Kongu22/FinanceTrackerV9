// src/components/TransactionTable.js
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaSyncAlt, FaCheck, FaTimes } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  styled,
  Button,
  Tooltip,
  Grid,
  Box,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  useTheme,
} from '@mui/material';
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

const TransactionTable = ({ transactions, editTransaction, deleteTransaction }) => {
  const { currentTranslations } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    description: '',
    amount: '',
    date: '',
    type: '',
    category: '',
    isRecurring: false,
    recurringDay: '',
    recurringStartDate: '',
    recurringEndDate: '',
  });

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({
      ...transaction,
      recurringDay: transaction.recurringDay || '',
      recurringStartDate: transaction.recurringStartDate || '',
      recurringEndDate: transaction.recurringEndDate || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveEdit = () => {
    // Ensure that the amount is stored as a number
    const updatedTransaction = {
      ...editData,
      amount: parseFloat(editData.amount), // Parse the amount as a float
    };
    editTransaction(updatedTransaction);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      description: '',
      amount: '',
      date: '',
      type: '',
      category: '',
      isRecurring: false,
      recurringDay: '',
      recurringStartDate: '',
      recurringEndDate: '',
    });
  };

  const categories = Object.keys(currentTranslations.categories).map((key) => ({
    key,
    label: currentTranslations.categories[key],
  }));

  const ModernButton = styled(Button)(({ theme }) => ({
    minWidth: '36px',
    height: '36px',
    margin: '0 4px',
    padding: 0,
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
    },
  }));

  const DeleteButton = styled(ModernButton)(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }));

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        maxHeight: '400px', // Restrict the height of the table container to 400px
        overflowY: 'auto', // Enable vertical scrolling when the height is exceeded
      }}
    >
      <Table stickyHeader size={isMobile ? 'small' : 'medium'} aria-label="transaction table">
        <TableHead>
          <TableRow>
            <TableCell>{currentTranslations.date}</TableCell>
            <TableCell>{currentTranslations.description}</TableCell>
            <TableCell>{currentTranslations.type}</TableCell>
            <TableCell>{currentTranslations.category}</TableCell>
            <TableCell>{currentTranslations.amount} (₪)</TableCell>
            {!isMobile && <TableCell>{currentTranslations.timestamp}</TableCell>} {/* Hide on mobile */}
            <TableCell>{currentTranslations.actions}</TableCell>
            <TableCell>{currentTranslations.recurring}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              sx={{
                bgcolor: transaction.type === 'Income' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              }}
            >
              {editingId === transaction.id ? (
                <TableCell colSpan="8">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box component="form" sx={{ width: isMobile ? '100%' : '80%', maxWidth: 400, mx: 'auto' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            label={currentTranslations.date}
                            type="date"
                            name="date"
                            value={editData.date}
                            onChange={handleEditChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size={isMobile ? 'small' : 'medium'}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={currentTranslations.description}
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            fullWidth
                            size={isMobile ? 'small' : 'medium'}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Select
                            label={currentTranslations.type}
                            name="type"
                            value={editData.type}
                            onChange={handleEditChange}
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
                        <Grid item xs={12}>
                          <Select
                            label={currentTranslations.category}
                            name="category"
                            value={editData.category}
                            onChange={handleEditChange}
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
                            {categories.map((cat) => (
                              <MenuItem key={cat.key} value={cat.key}>
                                <StyledIconWrapper>{categoryIcons[cat.key]}</StyledIconWrapper>
                                <Box sx={{ ml: 1 }}>{cat.label}</Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={currentTranslations.amount}
                            type="number"
                            name="amount"
                            value={editData.amount}
                            onChange={handleEditChange}
                            fullWidth
                            size={isMobile ? 'small' : 'medium'}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={editData.isRecurring}
                                onChange={handleEditChange}
                                name="isRecurring"
                              />
                            }
                            label={currentTranslations.recurringCheckboxLabel}
                          />
                        </Grid>
                        {editData.isRecurring && (
                          <>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Start Date"
                                type="date"
                                name="recurringStartDate"
                                value={editData.recurringStartDate}
                                onChange={handleEditChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                size={isMobile ? 'small' : 'medium'}
                                helperText="Select the start date for the recurring transaction"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Recurring Day"
                                type="number"
                                name="recurringDay"
                                value={editData.recurringDay}
                                onChange={handleEditChange}
                                fullWidth
                                size={isMobile ? 'small' : 'medium'}
                                helperText="Enter the day of the month for the recurring transaction"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="End Date"
                                type="date"
                                name="recurringEndDate"
                                value={editData.recurringEndDate}
                                onChange={handleEditChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                size={isMobile ? 'small' : 'medium'}
                                helperText="Select the end date for the recurring transaction"
                              />
                            </Grid>
                          </>
                        )}
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ModernButton onClick={saveEdit} sx={{ mr: 2 }}>
                              <StyledIconWrapper>
                                <FaCheck />
                              </StyledIconWrapper>
                            </ModernButton>
                            <ModernButton onClick={cancelEdit}>
                              <StyledIconWrapper>
                                <FaTimes />
                              </StyledIconWrapper>
                            </ModernButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </TableCell>
              ) : (
                <>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StyledIconWrapper>
                        {transaction.type === 'Income' ? <FaArrowUp color="green" /> : <FaArrowDown color="red" />}
                      </StyledIconWrapper>
                      <Box sx={{ ml: 1 }}>
                        {transaction.type === 'Income' ? currentTranslations.income : currentTranslations.expenses}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StyledIconWrapper>
                        {categoryIcons[transaction.category] || <MoreHorizIcon />}
                      </StyledIconWrapper>
                      <Box sx={{ ml: 1 }}>{currentTranslations.categories[transaction.category]}</Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: transaction.type === 'Income' ? 'green' : 'red',
                    }}
                  >
                    ₪{Number(transaction.amount).toFixed(2)}
                  </TableCell>
                  {!isMobile && <TableCell>{transaction.timestamp}</TableCell>} {/* Hide on mobile */}
                  <TableCell>
                    <Tooltip title={currentTranslations.updateBalance} arrow>
                      <ModernButton onClick={() => handleEdit(transaction)}>
                        <FaEdit />
                      </ModernButton>
                    </Tooltip>
                    <Tooltip title={currentTranslations.transactionDeleted} arrow>
                      <DeleteButton onClick={() => deleteTransaction(transaction.id)}>
                        <FaTrash />
                      </DeleteButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring && (
                      <Tooltip title={currentTranslations.recurringTooltip} arrow>
                        <StyledIconWrapper>
                          <FaSyncAlt style={{ color: 'green' }} />
                        </StyledIconWrapper>
                      </Tooltip>
                    )}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
