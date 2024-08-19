// src/components/StyledIconWrapper.js
import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Define the styled wrapper
const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  backgroundColor: 'orange', // Orange background
  padding: theme.spacing(0.5), // Adjust padding for size
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow for 3D effect
  color: theme.palette.primary.contrastText,
}));

// Functional component to wrap children
const StyledIconWrapper = ({ children }) => {
  return <IconWrapper>{children}</IconWrapper>;
};

export default StyledIconWrapper;
