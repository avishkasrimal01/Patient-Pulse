import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Modal,
  Grid,
  MenuItem,
  Fade,
  Backdrop,
  Paper,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert, // Import Alert from MUI for the Snackbar messages
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import autoTable plugin for better table formatting
import logo from '../../assets/images/logos/logo2.png';   // Import jsPDF for PDF generation
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const generateTimeSlots = () => {
  const startTime = 16; // 4:00 PM in 24-hour format
  const endTime = 21; // 9:00 PM in 24-hour format
  const slots = [];

  for (let hour = startTime; hour < endTime; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const timeString = `${hour < 10 ? '0' : ''}${hour}:${minutes === 0 ? '00' : minutes}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    appointmentType: 'physical',
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success messages
  const token = localStorage.getItem('token');

  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch appointments on component mount
  useEffect(() => {
    setLoading(true);
    axios
      .all([
        axios.get(`${apiUrl}/appointments/all`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/patients`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      .then(axios.spread((appointmentsRes, usersRes) => {
        setAppointments(appointmentsRes.data);
        setUsers(usersRes.data);
      }))
      .catch((err) => setError('Error fetching data'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (newAppointment.date || (selectedAppointment && selectedAppointment.date)) {
      const slots = generateTimeSlots();
      const currentDate = newAppointment.date || selectedAppointment.date;

      // Fetch all appointments for the selected date, regardless of the user
      axios
        .get(`${apiUrl}/appointments?date=${currentDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const bookedSlots = res.data.map((apt) => apt.time); // Collect booked time slots for all users

          // If editing an appointment, allow the current slot to remain available
          const excludeCurrentAppointment = selectedAppointment ? selectedAppointment._id : null;

          const available = slots.filter((slot) => !bookedSlots.includes(slot) ||
            res.data.some((apt) => apt._id === excludeCurrentAppointment && apt.time === slot)
          );

          setAvailableSlots(available);
        })
        .catch((err) => {
          console.error('Error fetching all appointments for the date', err);
        });
    }
  }, [newAppointment.date, selectedAppointment?.date, appointments, selectedAppointment]);

  // Handle creation of a new appointment
  const handleCreate = () => {
    if (!newAppointment.date || !newAppointment.time || !newAppointment.patientId) {
      setError('Please select a patient, date, and time for the appointment.');
      return;
    }
  
    setLoading(true);
    axios
      .post(`${apiUrl}/appointments`, newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAppointments([...appointments, res.data]);
        setNewAppointment({ patientName: '', patientId: '', date: '', time: '', appointmentType: 'physical' });
        setError('');
        setSuccessMessage('Appointment created successfully');
      })
      .catch((err) => {
        setError('Error creating appointment');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  // Handle selection of an appointment from the calendar
  const handleSelectAppointment = (appointment) => {
    // Find the full appointment details by ID
    const fullAppointment = appointments.find((apt) => apt._id === appointment._id);
    setSelectedAppointment(fullAppointment);
    setOpenModal(true);
    setError('');
  };

  // Handle updating the selected appointment
  const handleUpdate = () => {
    if (!selectedAppointment || !selectedAppointment._id) {
      setError('Selected appointment is invalid');
      return;
    }

    if (!selectedAppointment.date || !selectedAppointment.time) {
      setError('Please ensure both date and time are selected.');
      return;
    }

    setLoading(true);
    axios
      .put(
        `${apiUrl}/appointments/${selectedAppointment._id}`,
        selectedAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setAppointments(
          appointments.map((apt) =>
            apt._id === res.data._id ? res.data : apt
          )
        );
        setOpenModal(false);
        setSelectedAppointment(null);
        setError('');
        setSuccessMessage('Appointment updated successfully'); // Set success message
      })
      .catch((err) => {
        setError('Error updating appointment');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };



  // Open delete confirmation dialog
  const openDeleteConfirmation = (appointment) => {
    setAppointmentToDelete(appointment);
    setOpenConfirmDialog(true);
  };

  // Handle deletion of an appointment
  const handleDelete = () => {
    if (!appointmentToDelete) return;

    setLoading(true);
    axios
      .delete(`${apiUrl}/appointments/${appointmentToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAppointments(appointments.filter((apt) => apt._id !== appointmentToDelete._id));
        setOpenModal(false);
        setSelectedAppointment(null);
        setError('');
        setOpenConfirmDialog(false);
        setAppointmentToDelete(null);
        setSuccessMessage('Appointment deleted successfully'); // Set success message
      })
      .catch((err) => {
        setError('Error deleting appointment');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };


    // Function to generate a PDF report for appointments
    const generatePDF = (appointmentType) => {
      const filteredAppointments = appointments.filter(
        (apt) => apt.appointmentType === appointmentType
      );
    
      const doc = new jsPDF();
    
      // Add logo and title
      doc.addImage(logo, 'PNG', 10, 10, 30, 30); // Add your logo (adjust size and position)
      doc.setFontSize(22);
      doc.text('Patient Pulse - Appointment Report', 50, 25);
    
      doc.setFontSize(18);
      doc.text(
        `${appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)} Appointments`,
        14,
        50
      );
    
      // Add appointment data to a table
      const tableColumn = ['Patient', 'Date', 'Time', 'Type'];
      const tableRows = filteredAppointments.map((apt) => [
        apt.patientName || 'N/A',
        apt.date,
        apt.time,
        apt.appointmentType.charAt(0).toUpperCase() + apt.appointmentType.slice(1),
      ]);
    
      // Generate the table using autoTable plugin
      doc.autoTable({
        startY: 60,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 12, halign: 'center', valign: 'middle' },
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255] },
      });
    
      // Footer with branding
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text('© 2024 Patient Pulse. All Rights Reserved.', 14, pageHeight - 10);
    
      // Save the PDF with a dynamic filename
      doc.save(`${appointmentType}_appointments_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1200px', margin: 'auto' }}>

      {/* Modal for Creating Appointment */}
      <Fade in={true} timeout={2000}>
        <Card sx={{ mt: 4, p: 2, boxShadow: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6">Create New Appointment</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Patient"
                  value={newAppointment.patientId} // Use patientId as the value
                  onChange={(e) => {
                    const selectedPatient = users.find(user => user._id === e.target.value);
                    setNewAppointment({
                      ...newAppointment,
                      patientId: selectedPatient._id,
                      patientName: selectedPatient.name,
                    });
                  }}
                  fullWidth
                >
                  {users.map((patient) => (
                    <MenuItem key={patient._id} value={patient._id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      date: e.target.value,
                    })
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      time: e.target.value,
                    })
                  }
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!newAppointment.date} // Disable if no date is selected
                >
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <MenuItem key={index} value={slot}>
                        {slot}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No slots available</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Appointment Type"
                  value={newAppointment.appointmentType}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      appointmentType: e.target.value,
                    })
                  }
                  fullWidth
                >
                  <MenuItem value="physical">Physical</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Appointment'}
            </Button>
          </CardContent>
        </Card>
      </Fade>

      {selectedAppointment && (
        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedAppointment(null);
            setError('');
          }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
          }}
        >
          <Fade in={openModal}>
            <Paper
              elevation={5}
              sx={{
                padding: 3,
                margin: 'auto',
                maxWidth: 500,
                mt: { xs: 12, md: 15 },
                borderRadius: 2,
                position: 'relative',
              }}
            >
              {/* Display Appointment Details */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" color="textSecondary">
                  <strong>Appointment Details:</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {selectedAppointment.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong> {selectedAppointment.time}
                </Typography>
                <Typography variant="body1">
                  <strong>Type:</strong> {selectedAppointment.appointmentType.charAt(0).toUpperCase() + selectedAppointment.appointmentType.slice(1)}
                </Typography>
                {/* Add more details if available, e.g., patient name */}
                {selectedAppointment.patientName && (
                  <Typography variant="body1">
                    <strong>Patient Name:</strong> {selectedAppointment.patientName}
                  </Typography>
                )}
              </Box>

              {/* Edit Appointment Form */}
              <Typography variant="h5" gutterBottom>
                Edit Appointment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Date"
                    type="date"
                    value={selectedAppointment.date || ''}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        date: e.target.value,
                      })
                    }
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Time"
                    value={selectedAppointment.time || ''}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        time: e.target.value,
                      })
                    }
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => (
                        <MenuItem key={index} value={slot}>
                          {slot}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No slots available</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Appointment Type"
                    value={selectedAppointment.appointmentType || ''}
                    onChange={(e) =>
                      setSelectedAppointment({
                        ...selectedAppointment,
                        appointmentType: e.target.value,
                      })
                    }
                    fullWidth
                  >
                    <MenuItem value="physical">Physical</MenuItem>
                    <MenuItem value="remote">Remote</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Update'}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => openDeleteConfirmation(selectedAppointment)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Delete'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Modal>
      )}



      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to delete this appointment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ mt:3, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={() => generatePDF('physical')}>
          Download Physical Appointments PDF
        </Button>
        <Button variant="contained" color="primary" onClick={() => generatePDF('remote')}>
          Download Remote Appointments PDF
        </Button>
      </Box>

      {/* Calendar to display appointments */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          My Appointments
        </Typography>
        {loading && appointments.length === 0 ? (
          <CircularProgress />
        ) : (
          <Calendar
            localizer={localizer}
            events={appointments.map((apt) => {
              const [hours, minutes] = apt.time.split(':');
              const startDate = new Date(apt.date);
              startDate.setHours(parseInt(hours), parseInt(minutes));

              // Set the end time to 15 minutes after the start time
              const endDate = new Date(startDate);
              endDate.setMinutes(startDate.getMinutes() + 15);

              return {
                title: `${apt.appointmentType.charAt(0).toUpperCase() + apt.appointmentType.slice(1)} - ${apt.time}`,
                start: startDate,
                end: endDate,
                _id: apt._id,
                patientName: apt.patientName, // Assuming patientName exists
              };
            })}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectAppointment}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.appointmentType === 'remote' ? '#4caf50' : '#2196f3',
                color: 'white',
              },
            })}
          />
        )}
      </Box>
    </Box>
  );
};

export default Appointments;
