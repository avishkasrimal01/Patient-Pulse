import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor'; 
import axios from 'axios';

import polyImg from '../../assets/images/testimonial/poly.png';
import testiImg1 from '../../assets/images/testimonial/1.png';
import testiImg2 from '../../assets/images/testimonial/2.png';
import testiImg3 from '../../assets/images/testimonial/3.png';

import countIcon1 from '../../assets/images/counter/2.png';
import countIcon2 from '../../assets/images/counter/1.png';
import countIcon3 from '../../assets/images/counter/3.png';
import countIcon4 from '../../assets/images/counter/4.png';

const Testimonial = () => {
    const [state, setState] = useState(true);
    const [totalPhysicalAppointments, setTotalPhysicalAppointments] = useState(0);
    const [totalRemoteAppointments, setTotalRemoteAppointments] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);

    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        margin: 0,
        centerMode: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: true,
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                }
            }
        ]
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

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    
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
        <div className="student_satisfaction-section pt---110 pb---120">
            <div className="container"> 
                <div className="react__title__section-all pb---30">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">Patient Satisfaction</h6>
                            <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.5s">Patient Feedback</h2>
                        </div>                                
                    </div>                            
                </div>                       

                {/* Testimonial Slider */}
                <div className="feedreact-slider owl-carousel">
                    <Slider {...sliderSettings}>
                    <div className="event__card">
                            <div className="event__card--content">
                                <div className="event__card--content-area">
                                    <div className="testimonial__ratings">
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star_alt"></em>
                                        <span> (14 Reviews) </span>
                                    </div>
                                    <div className="parag">I was amazed by the level of personalized care at Patient Pulse. They took the time to understand my health history and lifestyle before recommending treatments. I now feel healthier and more balanced than I have in years.</div>
                                </div>
                                <img className="poly" src={polyImg} alt="image" />
                            </div>
                            <div className="author-sec">
                                <div className="icon">
                                    <img src={testiImg1} alt="image" />
                                </div>
                                <div className="text">
                                    <h4>Kasun Perera</h4>
                                    <p>Journalist</p>
                                </div>
                            </div>
                        </div>
                        <div className="event__card">
                            <div className="event__card--content">
                                <div className="event__card--content-area">
                                    <div className="testimonial__ratings">
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <span> (18 Reviews) </span>
                                    </div>
                                    <div className="parag">After suffering from joint pain for years, I decided to try Ayurvedic treatment at Patient Pulse. The team provided a detailed plan, and within a few weeks, I experienced significant relief without relying on medication. Their expertise in natural healing is truly remarkable.</div>
                                </div>
                                <img className="poly" src={polyImg} alt="image" />
                            </div>
                            <div className="author-sec">
                                <div className="icon">
                                    <img src={testiImg2} alt="image" />
                                </div>
                                <div className="text">
                                    <h4>Hansana Dhanuri</h4>
                                    <p>Teacher</p>
                                </div>
                            </div>
                        </div>
                        <div className="event__card">
                            <div className="event__card--content">
                                <div className="event__card--content-area">
                                    <div className="testimonial__ratings">
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star"></em>
                                        <em className="icon_star_alt"></em>
                                        <em className="icon_star_alt"></em>
                                        <span> (26 Reviews) </span>
                                    </div>
                                    <div className="parag">I've struggled with digestive issues for a long time, and nothing seemed to help until I visited Patient Pulse. Their natural remedies and dietary guidance have made a huge difference. I finally feel like my body is in harmony again.</div>
                                </div>
                                <img className="poly" src={polyImg} alt="image" />
                            </div>
                            <div className="author-sec">
                                <div className="icon">
                                    <img src={testiImg3} alt="image" />
                                </div>
                                <div className="text">
                                    <h4>Chandika Dewruwan</h4>
                                    <p>Manager</p>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>

            {/* Counters Section */}
            {counters &&
                <div className="count__area2 pb---100">
                    <div className="container">  
                        <ul className="row">
                            {counters.map((counter, num) => (  
                                <li key={num} className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6">
                                    <div className="count__content">
                                        <div className="icon">
                                            <img src={counter.countIcon} alt="icon" />
                                        </div>
                                        <div className="text">
                                            <CountUp start={state ? 0 : counter.countNum} end={counter.countNum} duration={10} onEnd={() => setState(false)} />
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
        </div>
    );
};

export default Testimonial;
