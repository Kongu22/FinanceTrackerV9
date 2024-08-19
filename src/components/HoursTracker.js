import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { PlayArrow, Stop, Edit, Delete, Save, Pause, PlayCircleFilled } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useLanguage } from './LanguageContext';
import { useTheme } from '@mui/material/styles';

const HoursTracker = () => {
  const { currentTranslations } = useLanguage();
  const theme = useTheme();

  const [entries, setEntries] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(60); // Default hourly rate
  const [editingId, setEditingId] = useState(null);
  const [monthlySummaryOpen, setMonthlySummaryOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const [isTracking, setIsTracking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [trackedStartTime, setTrackedStartTime] = useState(null);
  const [breaks, setBreaks] = useState([]); // Track breaks

  useEffect(() => {
    const savedEntries = localStorage.getItem('hoursEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('hoursEntries', JSON.stringify(entries));
    } else {
      localStorage.removeItem('hoursEntries'); // Clear storage when no entries exist
    }
  }, [entries]);

  const calculateHoursWorked = (start, end, totalBreakTimeInSeconds) => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);

    const totalTimeInSeconds = endTime.diff(startTime, 'second') - totalBreakTimeInSeconds;
    const finalTotalTimeInSeconds = Math.max(0, totalTimeInSeconds);

    const hours = Math.floor(finalTotalTimeInSeconds / 3600);
    const minutes = Math.floor((finalTotalTimeInSeconds % 3600) / 60);
    const seconds = finalTotalTimeInSeconds % 60;

    return { hours, minutes, seconds };
  };

  const calculateSalary = (hoursWorkedDecimal, hourlyRate) => {
    const regularHours = Math.min(hoursWorkedDecimal, 8); // Regular 8 hours
    const overtimeHours = Math.max(0, hoursWorkedDecimal - 8); // Overtime after 8 hours
    const overtimeRate = 1.25; // Overtime rate
    const extraOvertimeRate = 1.5; // Extra overtime rate

    const overtime1 = Math.min(overtimeHours, 2); // First 2 overtime hours
    const overtime2 = Math.max(0, Math.min(overtimeHours - 2, 2)); // Next 2 hours
    const remainingOvertime = Math.max(0, overtimeHours - 4); // Remaining overtime

    const regularSalary = regularHours * hourlyRate;
    const overtimeSalary1 = overtime1 * hourlyRate * overtimeRate;
    const overtimeSalary2 = overtime2 * hourlyRate * extraOvertimeRate;
    const extraOvertimeSalary = remainingOvertime * hourlyRate * extraOvertimeRate;

    return regularSalary + overtimeSalary1 + overtimeSalary2 + extraOvertimeSalary;
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    setTrackedStartTime(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    const endTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    const totalBreakTimeInSeconds = breaks.reduce((acc, breakItem) => {
      return acc + (dayjs(breakItem.end).diff(dayjs(breakItem.start), 'second') || 0);
    }, 0);

    const workedTime = calculateHoursWorked(trackedStartTime, endTime, totalBreakTimeInSeconds);
    const hoursWorkedDecimal = workedTime.hours + workedTime.minutes / 60 + workedTime.seconds / 3600;
    const totalSalary = calculateSalary(hoursWorkedDecimal, hourlyRate);

    const newEntry = {
      id: entries.length + 1,
      date: dayjs().format('YYYY-MM-DD'),
      startTime: dayjs(trackedStartTime).format('HH:mm:ss'),
      endTime: dayjs(endTime).format('HH:mm:ss'),
      hoursWorked: workedTime,
      totalSalary,
      breaks,
    };

    setEntries([...entries, newEntry]);
    setBreaks([]); // Reset breaks
    toast.success(currentTranslations.entryAdded);
  };

  const handleStartBreak = () => {
    setIsOnBreak(true);
    setBreaks([...breaks, { start: dayjs().format('YYYY-MM-DDTHH:mm:ss'), end: null }]);
  };

  const handleStopBreak = () => {
    setIsOnBreak(false);
    setBreaks(
      breaks.map((breakItem, index) => {
        if (index === breaks.length - 1) {
          return { ...breakItem, end: dayjs().format('YYYY-MM-DDTHH:mm:ss') };
        }
        return breakItem;
      })
    );
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id, date, startTime, endTime) => {
    const totalBreakTimeInSeconds = breaks.reduce((acc, breakItem) => {
      return acc + (dayjs(breakItem.end).diff(dayjs(breakItem.start), 'second') || 0);
    }, 0);

    const workedTime = calculateHoursWorked(`${date}T${startTime}`, `${date}T${endTime}`, totalBreakTimeInSeconds);
    const hoursWorkedDecimal = workedTime.hours + workedTime.minutes / 60 + workedTime.seconds / 3600;
    const totalSalary = calculateSalary(hoursWorkedDecimal, hourlyRate);

    const updatedEntries = entries.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            date,
            startTime,
            endTime,
            hoursWorked: workedTime,
            totalSalary,
          }
        : entry
    );
    setEntries(updatedEntries);
    setEditingId(null);
    toast.success(currentTranslations.entryUpdated);
  };

  const handleDelete = (id) => {
    if (window.confirm(currentTranslations.deleteEntryConfirmation)) {
      const updatedEntries = entries.filter((entry) => entry.id !== id);
      setEntries(updatedEntries);
      toast.info(currentTranslations.entryDeleted);
    }
  };

  const handleOpenClearDialog = () => {
    setClearDialogOpen(true);
  };

  const handleCloseClearDialog = () => {
    setClearDialogOpen(false);
  };

  const handleClearAllData = () => {
    setEntries([]);
    localStorage.removeItem('hoursEntries');
    toast.info(currentTranslations.allDataCleared);
    handleCloseClearDialog();
  };

  const getMonthlySummary = () => {
    const summary = {};

    for (let month = 0; month < 12; month++) {
      const monthKey = dayjs().month(month).format('MMMM');
      summary[monthKey] = { hoursWorked: 0, totalSalary: 0 };
    }

    entries.forEach((entry) => {
      const month = dayjs(entry.date).format('MMMM');
      if (summary[month]) {
        summary[month].hoursWorked += entry.hoursWorked?.hours + entry.hoursWorked?.minutes / 60 + entry.hoursWorked?.seconds / 3600 || 0;
        summary[month].totalSalary += entry.totalSalary;
      }
    });

    return summary;
  };

  const monthlySummary = getMonthlySummary();

  const handleOpenMonthlySummary = () => {
    setMonthlySummaryOpen(true);
  };

  const handleCloseMonthlySummary = () => {
    setMonthlySummaryOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ mt: 4, maxWidth: 800, mx: "auto" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            {currentTranslations.hoursTracker}
          </Typography>

          {/* Hourly Rate Input */}
          <Box mt={2} textAlign="center">
            <TextField
              label={currentTranslations.hourlyRate}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              type="number"
              variant="outlined"
              sx={{ width: 200 }}
            />
          </Box>

          {/* Use Grid to structure buttons and inputs */}
          <Grid container spacing={2} justifyContent="center" mt={2}>
            <Grid item>
              {isTracking ? (
                <>
                  <IconButton color="error" onClick={handleStopTracking}>
                    <Stop sx={{ fontSize: 60 }} />
                  </IconButton>
                  {isOnBreak ? (
                    <IconButton color="secondary" onClick={handleStopBreak}>
                      <PlayCircleFilled sx={{ fontSize: 60 }} />
                    </IconButton>
                  ) : (
                    <IconButton color="primary" onClick={handleStartBreak}>
                      <Pause sx={{ fontSize: 60 }} />
                    </IconButton>
                  )}
                </>
              ) : (
                <IconButton color="primary" onClick={handleStartTracking}>
                  <PlayArrow sx={{ fontSize: 60 }} />
                </IconButton>
              )}
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography variant="h6">{currentTranslations.workHoursSummary}</Typography>
            {entries.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 300,
                  overflowY: 'auto',
                  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: theme.palette.common.white }}>
                        <strong>{currentTranslations.date}</strong>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: theme.palette.common.white }}>
                        <strong>{currentTranslations.startTime}</strong>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: theme.palette.common.white }}>
                        <strong>{currentTranslations.endTime}</strong>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: theme.palette.common.white }}>
                        <strong>{currentTranslations.hoursWorked}</strong>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: '#ffffff' }}>
                        <strong>{currentTranslations.salary}</strong>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: theme.palette.common.white }}>
                        <strong>{currentTranslations.breakTime}</strong>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: '#7B1FA2', color: theme.palette.common.white }}>
                        <strong>{currentTranslations.actions}</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.map((entry, index) => (
                      <TableRow
                        key={entry.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? theme.palette.action.hover : theme.palette.background.paper,
                        }}
                      >
                        {editingId === entry.id ? (
                          <>
                            <TableCell>
                              <DatePicker
                                value={dayjs(entry.date)}
                                onChange={(newDate) =>
                                  setEntries((prevEntries) =>
                                    prevEntries.map((item) =>
                                      item.id === entry.id
                                        ? { ...item, date: newDate.format('YYYY-MM-DD') }
                                        : item
                                    )
                                  )
                                }
                                renderInput={(params) => <TextField {...params} fullWidth />}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="time"
                                value={entry.startTime}
                                onChange={(e) =>
                                  setEntries((prevEntries) =>
                                    prevEntries.map((item) =>
                                      item.id === entry.id
                                        ? { ...item, startTime: e.target.value }
                                        : item
                                    )
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="time"
                                value={entry.endTime}
                                onChange={(e) =>
                                  setEntries((prevEntries) =>
                                    prevEntries.map((item) =>
                                      item.id === entry.id
                                        ? { ...item, endTime: e.target.value }
                                        : item
                                    )
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {`${entry.hoursWorked?.hours?.toString().padStart(2, '0') || '00'}:${entry.hoursWorked?.minutes
                                ?.toString()
                                .padStart(2, '0') || '00'}:${entry.hoursWorked?.seconds?.toString().padStart(2, '0') || '00'}`}
                            </TableCell>
                            <TableCell>
                              ₪{calculateSalary(
                                entry.hoursWorked?.hours + entry.hoursWorked?.minutes / 60 + entry.hoursWorked?.seconds / 3600 || 0,
                                hourlyRate
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {entry.breaks
                                ? entry.breaks
                                    .map(
                                      (breakItem) =>
                                        `${dayjs(breakItem.start).format('HH:mm')} - ${
                                          breakItem.end
                                            ? dayjs(breakItem.end).format('HH:mm')
                                            : currentTranslations.onBreak
                                        }`
                                    )
                                    .join(', ')
                                : currentTranslations.noBreaks}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleSaveEdit(entry.id, entry.date, entry.startTime, entry.endTime)
                                }
                              >
                                <Save />
                              </IconButton>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{entry.startTime}</TableCell>
                            <TableCell>{entry.endTime}</TableCell>
                            <TableCell>
                              {`${entry.hoursWorked?.hours?.toString().padStart(2, '0') || '00'}:${entry.hoursWorked?.minutes
                                ?.toString()
                                .padStart(2, '0') || '00'}:${entry.hoursWorked?.seconds?.toString().padStart(2, '0') || '00'}`}
                            </TableCell>
                            <TableCell>
                              ₪{entry.totalSalary.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {entry.breaks
                                ? entry.breaks
                                    .map(
                                      (breakItem) =>
                                        `${dayjs(breakItem.start).format('HH:mm')} - ${
                                          breakItem.end
                                            ? dayjs(breakItem.end).format('HH:mm')
                                            : currentTranslations.onBreak
                                        }`
                                    )
                                    .join(', ')
                                : currentTranslations.noBreaks}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(entry.id)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(entry.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>{currentTranslations.noHoursTracked}</Typography>
            )}
          </Box>

          <Box mt={4}>
            <Button
              variant="outlined"
              sx={{
                color: theme.palette.text.primary,
                minWidth: 150,
                fontSize: '1rem',
                borderColor: theme.palette.divider,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.text.secondary,
                },
                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
              }}
              onClick={handleOpenMonthlySummary}
            >
              {currentTranslations.viewMonthlySummary}
            </Button>
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              color="error"
              sx={{
                color: '#fff',
                minWidth: 150,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
                boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
              }}
              onClick={handleOpenClearDialog}
            >
              {currentTranslations.removeAllData}
            </Button>
          </Box>

          <Dialog open={monthlySummaryOpen} onClose={handleCloseMonthlySummary}>
            <DialogTitle>{currentTranslations.monthlySummary}</DialogTitle>
            <DialogContent dividers>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>{currentTranslations.month}</strong></TableCell>
                      <TableCell><strong>{currentTranslations.totalHoursWorked}</strong></TableCell>
                      <TableCell><strong>{currentTranslations.totalSalary}</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(monthlySummary).map(([month, data]) => (
                      <TableRow key={month}>
                        <TableCell>{month}</TableCell>
                        <TableCell>{data.hoursWorked.toFixed(2)}</TableCell>
                        <TableCell>₪ {data.totalSalary.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseMonthlySummary} color="primary">
                {currentTranslations.close}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={clearDialogOpen} onClose={handleCloseClearDialog}>
            <DialogTitle>{currentTranslations.removeAllData}</DialogTitle>
            <DialogContent dividers>
              <Typography>{currentTranslations.deleteEntryConfirmation}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseClearDialog} color="primary">
                {currentTranslations.cancelEdit}
              </Button>
              <Button onClick={handleClearAllData} color="error">
                {currentTranslations.removeAllData}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default HoursTracker;
