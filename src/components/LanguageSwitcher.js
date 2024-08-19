// src/components/LanguageSwitcher.js
import React from 'react';
import { useLanguage } from './LanguageContext';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="language-select-label">Language</InputLabel>
      <Select
        labelId="language-select-label"
        value={language}
        onChange={(e) => switchLanguage(e.target.value)}
        label="Language"
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ru">Russian</MenuItem>
        <MenuItem value="he">Hebrew</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
