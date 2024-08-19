import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Collapse,
  IconButton,
  Paper,
  Card,
  CardContent,
  Avatar,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { useLanguage } from './LanguageContext';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';

const PasswordLock = ({ onUnlock, budgetLimit, transactions = [], initialBalance = 0 }) => {
  const theme = useTheme();
  const { currentTranslations } = useLanguage();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState(localStorage.getItem('appPassword') || '');
  const [isSettingPassword, setIsSettingPassword] = useState(!savedPassword);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // New state for password change
  const [showBudget, setShowBudget] = useState(false);

  useEffect(() => {
    if (savedPassword) {
      setIsSettingPassword(false);
    }
  }, [savedPassword]);

  const handlePasswordSubmit = () => {
    if (isSettingPassword) {
      // Setting a new password
      if (password.length === 4) {
        localStorage.setItem('appPassword', password);
        setSavedPassword(password);
        toast.success(currentTranslations.passwordSetSuccessfully);
        onUnlock();
      } else {
        toast.error(currentTranslations.passwordFourChars);
      }
    } else if (isChangingPassword) {
      // Changing the password
      if (password === savedPassword) {
        if (newPassword.length === 4) {
          localStorage.setItem('appPassword', newPassword);
          setSavedPassword(newPassword);
          setPassword('');
          setNewPassword('');
          setIsChangingPassword(false);
          toast.success(currentTranslations.passwordChangedSuccessfully);
        } else {
          toast.error(currentTranslations.passwordFourChars);
        }
      } else {
        toast.error(currentTranslations.incorrectPassword);
      }
    } else {
      // Login logic
      if (password === savedPassword) {
        toast.success(currentTranslations.welcomeBack);
        onUnlock();
      } else {
        toast.error(currentTranslations.incorrectPassword);
      }
    }
  };

  const toggleBudget = () => {
    setShowBudget((prev) => !prev);
  };

  const handleStartPasswordChange = () => {
    setIsChangingPassword(true);
    setPassword('');
    setNewPassword('');
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPassword('');
    setNewPassword('');
  };

  // Calculate the total expenses from transactions
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'Expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // Calculate the current balance
  const currentBalance = initialBalance - totalExpenses;

  // Calculate the percentage of the budget limit used
  const budgetUsedPercentage = budgetLimit > 0
    ? Math.min((totalExpenses / budgetLimit) * 100, 100).toFixed(2)
    : 0;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor={theme.palette.background.default}
      sx={{
        p: 2,
        pt: 1,
        mt: -10,
      }}
    >
      <Card
        sx={{
          width: 350,
          maxWidth: '90%',
          bgcolor: theme.palette.background.paper,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <CardContent>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mb: 2 }}>
            <LockIcon />
          </Avatar>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
            {isSettingPassword
              ? currentTranslations.setNewPassword
              : isChangingPassword
              ? currentTranslations.changePassword
              : currentTranslations.enterPassword}
          </Typography>

          {isChangingPassword ? (
            <>
              <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label={currentTranslations.currentPassword}
                inputProps={{ maxLength: 4 }}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                label={currentTranslations.newPassword}
                inputProps={{ maxLength: 4 }}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          ) : (
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ maxLength: 4 }}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordSubmit}
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark },
              mb: 3,
            }}
          >
            {isSettingPassword
              ? currentTranslations.setPassword
              : isChangingPassword
              ? currentTranslations.saveNewPassword
              : currentTranslations.login}
          </Button>

          {!isSettingPassword && !isChangingPassword && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleStartPasswordChange}
              fullWidth
              sx={{
                mb: 2,
              }}
            >
              {currentTranslations.changePassword}
            </Button>
          )}

          {isChangingPassword && (
            <Button
              variant="text"
              color="primary"
              onClick={handleCancelPasswordChange}
              fullWidth
            >
              {currentTranslations.cancel}
            </Button>
          )}
        </CardContent>

        <Collapse in={showBudget} timeout="auto" unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" gutterBottom>
              {currentTranslations.currentBalance}: ₪{currentBalance}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {currentTranslations.budgetLimit}: ₪{budgetLimit} ({budgetUsedPercentage}%)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={budgetUsedPercentage}
              sx={{ width: '100%', mb: 1 }}
            />
          </Paper>
        </Collapse>

        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
          <IconButton
            onClick={toggleBudget}
            sx={{
              borderRadius: '50%',
              bgcolor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.divider}`,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
              transition: 'transform 0.3s',
              transform: showBudget ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default PasswordLock;
