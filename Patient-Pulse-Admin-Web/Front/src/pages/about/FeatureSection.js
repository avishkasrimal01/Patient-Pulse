import React from 'react';

import { Link } from 'react-router-dom';


import icon1 from '../../assets/images/topics/icon.png'
import icon2 from '../../assets/images/topics/icon2.png'
import icon3 from '../../assets/images/topics/icon3.png'

const Feature = () => {

    return (
        <div className="react_populars_topics react_populars_topics2 react_populars_topics_about pb---80">
            <div className="react__title__section react__title__section-all">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">Our Qualities</h6>
                        <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.5s"> Why Choose Us? </h2>
                    </div>                                
                </div>                            
            </div>
            <div className="container">      
                <div className="row pt---30">
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.3s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="coureses-grid.html">Ancient Healing Techniques</a></h3>
                                <p>Our clinic is rooted in the ancient principles of Ayurveda, offering time-tested treatments that promote holistic healing and balance.</p>
                                </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.5s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="coureses-grid.html">Personalized Care</a></h3>
                                <p>We believe that every individual is unique, and so are their health needs. Our Ayurvedic treatments are tailored to each patient’s specific body constitution and imbalances.</p>
                            </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.7s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="coureses-grid.html">Natural Remedies</a></h3>
                                <p>We use only natural herbs and oils in our treatments, ensuring that your healing process is pure, organic, and free from harmful chemicals.</p>
                               </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.7s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="coureses-grid.html">Experienced Practitioners</a></h3>
                                <p>Our team consists of highly qualified Ayurvedic doctors and therapists, with years of experience in delivering effective treatments and therapies.</p>
                               </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.7s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="coureses-grid.html">Focus on Prevention</a></h3>
                                <p>Ayurveda not only addresses existing ailments but also focuses on disease prevention and maintaining balance in life through diet and lifestyle adjustments.</p>
                               </div>                                    
                        </div>
                    </div>
                    <div className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.7s">
                        <div className="item__inner">                                    
                            <div className="icon">
                                <img src={icon2} alt="Icon image" />
                            </div>
                            <div className="react-content">
                                <h3 className="react-title"><a href="coureses-grid.html">Holistic Approach</a></h3>
                                <p>Our treatments focus on healing the mind, body, and spirit, providing you with a complete wellness experience.</p>
                               </div>                                    
                        </div>
                    </div>                            
                </div>
            </div>
        </div>
    );
}

export default Feature;