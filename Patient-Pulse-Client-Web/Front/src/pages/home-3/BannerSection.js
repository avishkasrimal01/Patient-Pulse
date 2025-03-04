import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalVideo from 'react-modal-video';

import shape1 from "../../assets/images/hero/04.png";
import shape2 from "../../assets/images/hero/05.png";
import shape3 from "../../assets/images/hero/shape_03.png";
import shape4 from "../../assets/images/hero/shape_04.png";
import shape5 from "../../assets/images/hero/shape_05.png";

import bannerImg1 from "../../assets/images/hero/02.png";
import bannerImg2 from "../../assets/images/hero/03.png";

const HomeBanner = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const openModal = () => setIsOpen(!isOpen);

    useEffect(() => {
        // Check if token exists in localStorage to determine login status
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleAppointmentClick = () => {
        if (!isLoggedIn) {
            // If user is not logged in, redirect to login page
            navigate('/login');
        } else {
            // If logged in, navigate to appointments page
            navigate('/appointments');
        }
    };

    return (
        <>
            <div className="hero4__area pt-160 pb-150 md-pt-90">
                <ModalVideo channel='youtube' isOpen={isOpen} videoId='e5Hc2B50Z7c' onClose={openModal} />
                <div className="hero4__shape">
                    <img className="hero4__shape-1" src={shape1} alt="Banner shape image" />
                    <img className="hero4__shape-2" src={shape2} alt="Banner shape image" />
                    <img className="hero4__shape-3" src={shape3} alt="Banner shape image" />
                    <img className="hero4__shape-4" src={shape4} alt="Banner shape image" />
                    <img className="hero4__shape-5" src={shape5} alt="Banner shape image" />
                </div>
                <div className="container hero4__width">
                    <div className="row">
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="hero4__content">
                                <h1 className="hero4__title wow animate__fadeInUp" data-wow-duration="0.3s">Welcome to Our Ayurvedic Medical Center</h1>
                                <p className="hero4__paragraph wow animate__fadeInUp" data-wow-duration="0.5s">
                                    "The natural healing force within each of us is the greatest force <br />
                                    in getting well."
                                    <br /> - Hippocrates, Father of Medicine -
                                </p>
                                <div className="event__video-btn--plays">
                                    {/* Handle appointment button click */}
                                    <button
                                        onClick={handleAppointmentClick}
                                        className="hero4-btn wow animate__fadeInUp"
                                        data-wow-duration="0.7s"
                                    >
                                        Book an Appointment
                                    </button>
                                    <Link
                                        to="https://www.youtube.com/embed/4jn77iLBtrs?si=g8rVNIpGx0y3SQ3A"
                                        onClick={openModal}
                                        className="event__videos custom-popup wow animate__fadeInUp"
                                        data-wow-duration="0.9s"
                                    >
                                        <i className="arrow_triangle-right"></i>
                                        <em>Watch video</em>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="hero4__image">
                                <img className="hero4__image-1" src={bannerImg1} alt="The girl are pointing to the left side" />
                                <img className="hero4__image-2" src={bannerImg2} alt="The boy are grabbing some books" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeBanner;
