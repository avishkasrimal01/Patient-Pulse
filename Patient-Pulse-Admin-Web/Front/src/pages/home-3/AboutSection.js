import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import Slider from "react-slick";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor'; 
import axios from 'axios';

import countIcon1 from '../../assets/images/counter/2.png';
import countIcon2 from '../../assets/images/counter/1.png';
import countIcon3 from '../../assets/images/counter/3.png';
import countIcon4 from '../../assets/images/counter/4.png';
// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const About = () => {

    const [state, setState] = useState(true);
    const [totalPhysicalAppointments, setTotalPhysicalAppointments] = useState(0);
    const [totalRemoteAppointments, setTotalRemoteAppointments] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);
    const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 }); // Added state for gender counts
    const apiUrl = process.env.REACT_APP_API_BASE_URL;


    // Sample data for the Bar chart
    const [appointmentData, setAppointmentData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Appointments per Day',
                data: [0, 0, 0, 0, 0, 0, 0],  // Initialize with zeros
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    });


    const patientGenderData = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [genderCounts.male, genderCounts.female],
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const counters = [
        {
            countNum: totalPhysicalAppointments,  // This will be updated by API
            countTitle: 'Total Physical Appointments',
            countSubtext: '',
            countIcon: countIcon1,
        },
        {
            countNum: totalRemoteAppointments,
            countTitle: 'Total Remote Appointments',
            countSubtext: '',
            countIcon: countIcon2,
        },
        {
            countNum : totalPatients,
            countTitle: 'Registered Patients',
            countSubtext: '',
            countIcon: countIcon3,
        },
        {
            countNum : 10,
            countTitle: 'Years of Experience',
            countSubtext: '',
            countIcon: countIcon4,
        }
    ];


     // Fetch gender count data when the component mounts
     useEffect(() => {
        const fetchGenderCounts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/patients/gender-count`);
                setGenderCounts(response.data); // Set gender counts from backend response
            } catch (error) {
                console.error("Error fetching gender counts:", error);
            }
        };

        fetchGenderCounts();
    }, [apiUrl]);


        // Fetch the total appointments for each day of the week
        useEffect(() => {
            const fetchAppointmentData = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/appointments/per-day`); // Replace with your actual backend route
                    const data = response.data; // Assuming data is an array like [12, 19, 8, 10, 15, 9, 7]
    
                    // Update chart data
                    setAppointmentData((prevData) => ({
                        ...prevData,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: data,  // Set the data from the backend
                            },
                        ],
                    }));
                } catch (error) {
                    console.error("Error fetching appointment data:", error);
                }
            };
    
            fetchAppointmentData();
        }, [apiUrl]);

    // Fetch total physical appointments when component mounts
    useEffect(() => {
        const fetchTotalPhysicalAppointments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/appointments/physical-count`); // Replace with your actual backend route
                setTotalPhysicalAppointments(response.data.count);
            } catch (error) {
                console.error("Error fetching total physical appointments:", error);
            }
        };

        fetchTotalPhysicalAppointments();
    }, []);
    useEffect(() => {
        const fetchTotalRemoteAppointments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/appointments/remote-count`); // Replace with your actual backend route
                setTotalRemoteAppointments(response.data.count);
            } catch (error) {
                console.error("Error fetching total remote appointments:", error);
            }
        };

        fetchTotalRemoteAppointments();
    }, []);
    useEffect(() => {
        const fetchTotalPatients = async () => {
            try {
                const response = await axios.get(`${apiUrl}/total-patients`); // Replace with your actual backend route
                setTotalPatients(response.data.count);
            } catch (error) {
                console.error("Error fetching total patients:", error);
            }
        };

        fetchTotalPatients();
    }, []);

    return (
        <div className="about__area about2__area about3__area p-relative pb---60">
            <div className="container">
               {/* Counters Section */}
            {counters &&
                <div className="count__area2 pt---100 pb---100">
                    <div className="container">  
                        <ul className="row">
                            {counters.map((counter, num) => (  
                                <li key={num} className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6">
                                    <div className="count__content">
                                        <div className="icon">
                                            <img src={counter.countIcon} alt="icon" />
                                        </div>
                                        <div className="text">
                                            <CountUp start={state ? 0 : counter.countNum} end={counter.countNum} duration={6} onEnd={() => setState(false)} />
                                            {({ countUpRef, start }) => (
                                                <VisibilitySensor onChange={start} delayedCall>
                                                    <span ref={countUpRef} />
                                                    <span className="count__content-title counter">{counter.countNum}</span>
                                                </VisibilitySensor>
                                            )}
                                            <em>{counter.countSubtext}</em>
                                            <p className="count__content">{counter.countTitle}</p> 
                                        </div>                                           
                                    </div>
                                </li>
                            ))} 
                        </ul>                             
                    </div>
                </div>
            } 

                {/* Counters and Charts Section */}
                <Box sx={{ marginTop: '2rem' }}>
                    <Grid container spacing={3}>
                        {/* Bar Chart for Appointments */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ padding: '1rem' }}>
                                <Typography variant="h6">Appointments per Day</Typography>
                                <Bar data={appointmentData} options={{ responsive: true }} />
                            </Paper>
                        </Grid>

                        {/* Pie Chart for Patient Genders */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ padding: '1rem' }}>
                                <Typography variant="h6">Patient Gender Distribution</Typography>
                                <Pie data={patientGenderData} options={{ responsive: true }} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    );
};

export default About;
