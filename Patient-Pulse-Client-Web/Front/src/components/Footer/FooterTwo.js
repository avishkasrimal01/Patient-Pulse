
import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/images/logos/footer-logo.png';

const FooterTwo = (props) => {
    const { footerLogo, footerClass, ctaSubtitle, ctaTitle, ctaBtn } = props;
    return (
        <>
            <footer id="react-footer" className={footerClass ? footerClass : 'react-footer react-footer-two pt---120'}>
                <div className="footer-top">
                    <div className="container">
                        <div className="footer-top-cta wow animate__fadeInUp" data-wow-duration="0.6s">
                            <div className="row">
                                <div className="col-lg-7">
                                    <h4>{ctaSubtitle ? ctaSubtitle : 'Patient Pulse Ayuruvedic Medical Center'}</h4>
                                    <h3>{ctaTitle ? ctaTitle : 'Quickly Book Your Appoinment.'}</h3>
                                </div>
                                <div className="col-lg-5 text-right">
                                    <Link to="/appointments">{ctaBtn ? ctaBtn : 'Book an Appoinment'} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 md-mb-30">
                                <div className="footer-widget footer-widget-1">
                                    <div className="footer-logo white">
                                        <Link to="index.html" className="logo-text"> <img src={footerLogo ? footerLogo : Logo} alt="logo" /></Link>
                                    </div>
                                    <h5 className="footer-subtitle">Providing excellent medical care since 2014. Our commitment to your health and well-being is unmatched. <br/></h5>
                                    <ul className="footer-address">
                                        <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><a href="tel:+(94)766474436"> +(94) 76 647 4436 </a></li>
                                        <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><a href="mailto:patientpulseinfo@gmail.com"> patientpulseinfo@gmail.com </a></li>
                                    </ul>                               
                                </div>
                            </div>
                            <div className="col-lg-3 md-mb-30">
                                <div className="footer-widget footer-widget-2">
                                    <h3 className="footer-title">Quick Links</h3>
                                    <div className="footer-menu">
                                        <ul>
                                            <li><Link to="/home-3">Home</Link></li>
                                            <li><Link to="/appointments">Appointments</Link></li>
                                            <li><Link to="https://video-convo-one.vercel.app/mymeetings">Conference</Link></li>
                                            <li><Link to="/about">About</Link></li>
                                            <li><Link to="/contact">Contact</Link></li>
                                            <li><Link to="/login">Login</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 md-mb-30">
                                <div className="footer-widget footer-widget-3">
                                    <h3 className="footer-title">Open Hours</h3>
                                    <div className="footer-menu">
                                        <ul>
                                            <li><Link to="#">Monday - Friday: 16:00 - 21:00</Link></li>
                                            <li><Link to="#">Saturday: 10:30 - 16:00</Link></li>
                                            <li><Link to="#">Sunday & Poya Day - Closed</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="footer-widget footer-widget-4">
                                    <h3 className="footer-title">Newsletter</h3> 
                                    <div className="footer3__form">
                                        <p>Subscribe to our newsletter to get the latest news and updates in your inbox.</p>
                                        <form action="#">
                                            <input type="email" required placeholder="Enter your email" />
                                            <button className="footer3__form-1">
                                                <i className="arrow_right"></i>
                                            </button>
                                        </form>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="copyright">  
                    <div className="container">                  
                        <div className="react-copy-left">© 2024 <Link to="/">Patient Pulse.</Link> All Rights Reserved</div>
                        <div className="react-copy-right">
                            <ul className="social-links">
                                <li className="follow">Follow us</li>
                                <li><Link to="#"><span aria-hidden="true" className="social_facebook"></span></Link></li>
                                <li><Link to="#"><span aria-hidden="true" className="social_twitter"></span></Link></li>
                                <li><Link to="#"><span aria-hidden="true" className="social_linkedin"></span></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default FooterTwo;