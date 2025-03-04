import React from 'react';
import { Link } from 'react-router-dom';

// Image
import aboutImg from '../../assets/images/about/ab3.png';
import shapeImg1 from '../../assets/images/about/shape_02.png';

const About = () => {

    return (
        <div class="about__area about2__area about3__area p-relative pb---60">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="about__image wow animate__fadeInUp" data-wow-duration="0.3s">
                            <img class="react__shape__1" src={shapeImg1} alt="Shape Image" />
                            <img src={aboutImg} alt="About" />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="about__content">
                            <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">About Us</h6>
                            <h2 class="about__title wow animate__fadeInUp" data-wow-duration="0.5s">Your Path to Holistic Healing</h2>
                            <p class="about__paragraph wow animate__fadeInUp" data-wow-duration="0.7s">At our Ayurvedic Medical Center, we focus on holistic health using time-tested, natural healing methods rooted in the principles of Ayurveda. Our expert team of practitioners is dedicated to providing personalized care that brings balance to your body, mind, and soul. Whether you are looking to manage stress, improve your overall well-being, or treat a specific condition, we are here to help you achieve optimal health.</p>
                            <ul>
                                <li className="wow animate__fadeInUp" data-wow-duration="0.3s"><i class="icon_check"></i> Natural, Safe, and Effective Remedies. </li>
                                <li className="wow animate__fadeInUp" data-wow-duration="0.5s"><i class="icon_check"></i> Expert Team of Practitioners. </li>
                            </ul>
                            <div class="about__btn wow animate__fadeInUp" data-wow-duration="0.7s">
                                <Link to="/about"> Read More </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;