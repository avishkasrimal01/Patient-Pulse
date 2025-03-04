import React from 'react';
import { Link } from 'react-router-dom';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// Image

import shapeImg1 from '../../assets/images/tab/shape_01.png';
import shapeImg2 from '../../assets/images/tab/shape_02.png';
import shapeImg3 from '../../assets/images/tab/shape_03.png';

import tabImg1 from '../../assets/images/tab/1.png';
import tabImg2 from '../../assets/images/tab/2.png';
import tabImg3 from '../../assets/images/tab/3.png';
import tabImg4 from '../../assets/images/tab/4.png';

const Video = () => {

    const tabStyle = 'nav nav-tabs';

    return (
        <div className="high_quality-section pt---20 pb---120">
            <div className="container">
                <div className="react__title__section-all">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">Patient Pulse Ayurvedic Medical Center</h6>
                            <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.3s">High Quality Video</h2>
                        </div>                                
                    </div>                            
                </div>
                <Tabs>
                    <div className="react-tab-gird wow animate__fadeInUp" data-wow-duration="0.3s">
                        <div className="tab-content text-center">
                            <img className="shape__1" src={shapeImg1} alt="image" />
                            <img className="shape__2" src={shapeImg2} alt="image" />
                            <img className="shape__3" src={shapeImg3} alt="image" />
                            <TabPanel>
                                <div className="tab-pane active" id="home">
                                <iframe width="970" height="576" src="https://www.youtube.com/embed/jKanQuHUzJM?si=5SMMjUo8ew5jWjFY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="tab-pane" id="profile">
                                <iframe width="970" height="576" src="https://www.youtube.com/embed/4jn77iLBtrs?si=u_ov0HGdIYwA4yxv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
                            </TabPanel>
                            <TabPanel>
                                <div className="tab-pane" id="messages">
                                    <iframe width="970" height="576" src="https://www.youtube.com/embed/ZG5DFPSKXmI?si=gUg-RqCm3ba-1h6f" title="YouTube video player" allow="accelerometer"></iframe>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="tab-pane" id="settings">
                                    <iframe width="970" height="576" src="https://www.youtube.com/embed/miRMPPJ2hEQ?si=ZwGHDZi0hC3dwxhE" title="YouTube video player" allow="accelerometer"></iframe>
                                </div>
                            </TabPanel>
                        </div>
                        <TabList className={tabStyle}>
                            <Tab>
                                <button>
                                    <em className="icon"><img src={tabImg1} alt="image" /></em>
                                    <em className="text">Introduction</em>
                                </button>
                            </Tab>
                            <Tab>
                                <button>
                                    <em className="icon"><img src={tabImg1} alt="image" /></em>
                                    <em className="text">Logo</em>
                                </button>
                            </Tab>
                            <Tab>
                                <button>
                                    <em className="icon"><img src={tabImg1} alt="image" /></em>
                                    <em className="text">Covid 19</em>
                                </button>
                            </Tab>
                            <Tab>
                                <button>
                                    <em className="icon"><img src={tabImg1} alt="image" /></em>
                                    <em className="text">Gastritis</em>
                                </button>
                            </Tab>
                        </TabList>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

export default Video;