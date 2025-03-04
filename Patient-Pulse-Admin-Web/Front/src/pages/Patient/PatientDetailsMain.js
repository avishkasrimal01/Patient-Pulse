import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';

const PatientDetailsMain = () => {

    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_BASE_URL;


    // Function to fetch all patients initially
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const response = await axios.get(`${apiUrl}/patients`, config);
                setPatients(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast.error("Unauthorized access. Please log in.");
                    navigate('/login');
                } else {
                    toast.error("Failed to fetch patients");
                }
            }
        };

        fetchPatients();
    }, [navigate, apiUrl]);

    // Handle search by email
    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Fetch patients by email
            const response = await axios.get(`${apiUrl}/patients/search?email=${searchQuery}`, config);

            if (response.data.length > 0) {
                setPatients(response.data);  // Set the search results in the state
            } else {
                toast.error("No patients found with this email.");
            }
        } catch (error) {
            toast.error("Failed to fetch patient details");
        }
    };

    const handlePatientClick = async (patientEmail) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${apiUrl}/patients/search?email=${patientEmail}`, config);
            const patient = response.data[0];

            if (patient && patient.userId) {
                navigate(`/profile/${patient.userId}`);
            } else {
                toast.error("User ID not found for this patient.");
            }
        } catch (error) {
            toast.error("Failed to fetch patient details");
        }
    };

    const handleAdd = () => {
        navigate('/signup');
    };



    const generatePDFReport = () => {
        const doc = new jsPDF();
    
        // Add a title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Patient Report', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
        // Add a subtitle with the current date
        const date = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${date}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
        // Table headers
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const headers = ["User ID", "Name", "Email"];
        const tableStartY = 40;
        const colWidths = [60, 60, 70]; // Column widths (adjusted for User ID column)
        const rowHeight = 10;
    
        // Add headers
        headers.forEach((header, index) => {
            const xPosition = 10 + colWidths.slice(0, index).reduce((a, b) => a + b, 0);
            doc.text(header, xPosition, tableStartY);
        });
    
        // Ensure patient data is valid and add rows
        let y = tableStartY + rowHeight;
        doc.setFont('helvetica', 'normal');
        patients.forEach((patient) => {
            // Ensure userId, name, and email are valid strings
            const userId = patient.userId || 'N/A';
            const name = patient.name || 'N/A';
            const email = patient.email || 'N/A';
    
            // Add userId, name, and email to the table
            doc.text(userId, 10, y);  // User ID
            doc.text(name, 70, y);    // Patient name
            doc.text(email, 130, y);  // Patient email
            y += rowHeight;
    
            // Add a new page if needed
            if (y > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                y = 20; // Reset Y for the new page
            }
        });
    
        // Add a footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('End of Report', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    
        doc.save('patient_report.pdf'); // Save the generated PDF
    };
    
    


    return (
        <div className="container pt---30 pb---50">
            <ToastContainer />

            <TextField
                label="Search by email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                fullWidth
                autoFocus="false"
            />

            <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginTop: '10px' }}>
                Search
            </Button>
            <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginTop: '10px', marginLeft: '10px' }}>
                Add Patient
            </Button>
            {/* Button to generate PDF report */}
            <Button variant="contained" color="primary" onClick={generatePDFReport} style={{ marginTop: '10px', marginLeft: '10px' }}>
                Generate Report
            </Button>

            <List style={{ marginTop: '20px' ,marginBottom:'150px'}}>
                {patients.map((patient) => (
                    <React.Fragment key={patient._id}>
                        <ListItem button onClick={() => handlePatientClick(patient.email)}>
                            <ListItemText primary={`${patient.name}`} secondary={patient.email} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
};

export default PatientDetailsMain;
