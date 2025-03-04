import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const SignupMain = () => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        number: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false // Track Terms & Conditions agreement
    });

    const [error, setError] = useState(''); // State to store any signup errors
    const navigate = useNavigate();

    // Update form state when input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Ensure user has agreed to Terms & Conditions
        if (!formData.agree) {
            setError('You must agree to the Terms & Conditions.');
            return;
        }

        try {
            // Send data to your backend (MongoDB)
            await axios.post(`${apiUrl}/signup`, formData);
            alert('A verification email has been sent to your email address.');
            // Redirect to login page after successful sign up
            navigate('/login');
        } catch (error) {
            setError('Error signing up. Please try again.');
            console.error('Error signing up', error);
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
                                        <h3>Sign Up</h3>
                                        <p>Already have an account? <a href="/login">Log in</a></p>
                                    </div>
                                    <p>
                                        <label>Name</label>
                                        <input
                                            placeholder="Full Name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label>Date of Birth</label>
                                        <input
                                            placeholder="Date of Birth"
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label>Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </p>
                                    <p>
                                        <label>Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </p>
                                    <p>
                                        <label>Phone Number</label>
                                        <input
                                            placeholder="Phone Number"
                                            type="text"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label>Email</label>
                                        <input
                                            placeholder="Email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label>Password</label>
                                        <input
                                            placeholder="Password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <p>
                                        <label>Confirm Password</label>
                                        <input
                                            placeholder="Confirm Password"
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </p>
                                    <div className="back-check-box">
                                        <input
                                            type="checkbox"
                                            id="box-1"
                                            name="agree"
                                            checked={formData.agree}
                                            onChange={handleChange}
                                            required
                                        /> I agree to the <em>Terms & Conditions</em>
                                        <p></p>
                                    </div>
                                    {/* Error message box */}
                                    {error && (
                                        <div className="error-message-box">
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    <button type="submit" id="button" name="submit">
                                        Register
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignupMain;
