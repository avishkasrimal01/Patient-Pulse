import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import countIcon1 from '../../assets/images/profile/2.png';
import countIcon2 from '../../assets/images/profile/3.png';
import countIcon3 from '../../assets/images/profile/4.png';
import profileicon from '../../assets/images/instructor/1.jpg';

const InstructorDetailsMain = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [totalRemoteAppointments, setTotalRemoteAppointments] = useState(0);
    const [totalPhysicalAppointments, setTotalPhysicalAppointments] = useState(0);
    const [state, setState] = useState(true);


    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchTotalRemoteAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/user/remoteCount`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalRemoteAppointments(response.data.count);
            } catch (error) {
                console.error("Error fetching total remote appointments:", error);
            }
        };
        fetchTotalRemoteAppointments();
    }, []);

    useEffect(() => {
        const fetchTotalPhysicalAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/user/physicalCount`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalPhysicalAppointments(response.data.count);
            } catch (error) {
                console.error("Error fetching total physical appointments:", error);
            }
        };
        fetchTotalPhysicalAppointments();
    }, []);

    useEffect(() => {
        const fetchPatientProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatient(response.data);
            } catch (error) {
                console.error('Error fetching patient profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientProfile();
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me out!',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
                toast.success('Successfully logged out!');
            }
        });
    };

    const handleDeleteAccount = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will request account deletion. Please confirm!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, request deletion!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.post(
                        `${apiUrl}/request-delete-account`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success('Deletion email sent! Please confirm via your inbox.');
                    navigate('/signup');
                } catch (error) {
                    toast.error('Failed to request account deletion');
                }
            }
        });
    };


    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const counters = [
        { countNum: totalPhysicalAppointments, countTitle: 'Physical Appointments', countIcon: countIcon1 },
        { countNum: totalRemoteAppointments, countTitle: 'Remote Appointments', countIcon: countIcon2 },
        { countNum: 208, countTitle: '', countIcon: countIcon3 },
    ];

    if (loading) return <div>Loading...</div>;
    if (!patient) return <div>Error: No patient data found</div>;

    const age = patient.dob ? calculateAge(patient.dob) : 'N/A';

    return (
        <>
            <div className="profile-top back__course__area pt---120 pb---90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <img src={profileicon} alt={patient.name || 'Unknown'} />
                        </div>
                        <div className="col-lg-8">
                            <ul className="user-section">
                                <li><span>Name:</span> <em>{patient.name || 'Unknown'}</em></li>
                                <li>Phone: <em>{patient.number || 'N/A'}</em></li>
                                <li>Email: <em>{patient.email || 'N/A'}</em></li>
                                <li>Blood Group: <em>{patient.bloodGroup || 'N/A'}</em></li>
                                <li>Gender: <em>{patient.gender || 'N/A'}</em></li>
                                <li>Age: <em>{age}</em></li>
                            </ul>

                            <div className="count__area2">
                                <ul className="row">
                                    {counters.map((counter, num) => (
                                        <li key={num} className="col-lg-4">
                                            <div className="count__content">
                                                <div className="icon">
                                                    <img src={counter.countIcon} alt="profile" />
                                                </div>
                                                <div className="text">
                                                    <CountUp start={state ? 0 : counter.countNum} end={counter.countNum} duration={5} onEnd={() => setState(false)} />
                                                    {({ countUpRef, start }) => (
                                                        <VisibilitySensor onChange={start} delayedCall>
                                                            <span ref={countUpRef} />
                                                            <span className="count__content-title counter">{counter.countNum}</span>
                                                        </VisibilitySensor>
                                                    )}
                                                    <p>{counter.countTitle}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="profile-button-container">
                                <button className="follows" onClick={handleLogout}>LogOut</button>
                                <button className="follows delete" onClick={handleDeleteAccount}>Delete Profile</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default InstructorDetailsMain;
