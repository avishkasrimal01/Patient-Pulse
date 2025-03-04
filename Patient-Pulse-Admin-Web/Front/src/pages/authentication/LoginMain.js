import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const LoginMain = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        console.log("Form submitted with credentials:", credentials); // Debugging line
        try {
            const response = await axios.post(`${apiUrl}/admin/login`, credentials);
            console.log("API response:", response.data); // Debugging line
            localStorage.setItem('token', response.data.token); // Store JWT token
            navigate('/home'); // Redirect to appointments page
        } catch (error) {
            console.error("Error occurred:", error.response || error.message); // Debugging line
            setError(error.response?.data || 'An error occurred.'); // Display error message
        }
    };
    

    return (
        <>
            <div className="react-login-page react-signup-page pt---50 pb---50">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="login-right-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="login-top">
                                        <h3>Login</h3>
                                    </div>

                                    {error && (
                                        <div className="error-message">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <p>
                                        <label>UserName</label>
                                        <input
                                            placeholder="username"
                                            type="text"
                                            id="text"
                                            name="username"
                                            value={credentials.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label>Password</label>
                                        <input 
                                            placeholder="Password" 
                                            type="password" 
                                            id="pass" 
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    
                                    <button type="submit" id="button" name="submit">
                                        LogIn 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginMain;
