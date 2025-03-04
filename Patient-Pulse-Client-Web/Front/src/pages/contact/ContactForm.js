import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const ContactForm = () => {
    // State to store patient details
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    // Effect to load patient details from API using JWT token
    useEffect(() => {
        const fetchPatientDetails = async () => {
            const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
            if (token) {
                try {
                    const response = await axios.get(`${apiUrl}/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const patientData = response.data;
                    setUser({
                        name: patientData.name || '',
                        email: patientData.email || '',
                        phone: patientData.number || ''
                    });
                } catch (error) {
                    console.error('Error fetching patient details:', error);
                }
            }
        };
        fetchPatientDetails();
    }, []);

    // Function to handle form submission
    // Function to handle form submission
function sendEmail(e) {
    e.preventDefault();

    fetch(`${apiUrl}/contact`, { // Ensure the correct API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_name: e.target.user_name.value,
            user_email: e.target.user_email.value,
            user_subject: e.target.user_subject.value,
            user_phone: e.target.user_phone.value,
            user_message: e.target.user_message.value,
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // If response is ok, parse JSON
        } else {
            throw new Error('Failed to send message'); // Throw error for non-2xx status codes
        }
    })
    .then(result => {
        // Display success message if backend responds correctly
        Swal.fire({
            title: 'Message Sent!',
            text: 'Your message has been successfully sent.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        // Display error message in case of a failure
        Swal.fire({
            title: 'Error!',
            text: 'There was an issue sending your message. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error('Error:', error);
    });

    e.target.reset(); // Reset the form after submission
}


    return (
        <div className="react-blog-form">
            <h2 className="contact-title">Questions? <br/> Feel free to contact us.</h2>
            <div id="blog-form" className="blog-form">
                <div id="form-messages"></div>
                <form id="contact-form" onSubmit={sendEmail}>                                                    
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="back-input">
                                <input 
                                    id="name" 
                                    type="text" 
                                    name="user_name" 
                                    required 
                                    placeholder="Name" 
                                    value={user.name}
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6 pdl-5">
                            <div className="back-input">
                                <input 
                                    id="email" 
                                    type="email" 
                                    name="user_email" 
                                    required 
                                    placeholder="Email" 
                                    value={user.email}
                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                />                          
                            </div>
                        </div>
                        
                        <div className="col-lg-6">
                            <div className="back-input">
                                <input 
                                    id="subject" 
                                    type="text" 
                                    name="user_subject" 
                                    required 
                                    placeholder="Subject" 
                                />                          
                            </div>
                        </div>

                        <div className="col-lg-6 pdl-5">
                            <div className="back-input">
                                <input 
                                    id="phone" 
                                    type="text" 
                                    name="user_phone" 
                                    required 
                                    placeholder="Phone" 
                                    value={user.phone}
                                    onChange={(e) => setUser({...user, phone: e.target.value})}
                                />                   
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="back-textarea">
                                <textarea 
                                    id="message" 
                                    name="user_message" 
                                    required 
                                    placeholder="Message"
                                ></textarea>
                            </div>
                        </div>

                        <div className="col-lg-12">                                                
                            <button type="submit" className="back-btn">Send Message 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>                                                    
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
