import React from 'react';
import { Link } from 'react-router-dom'

import instructors from '../../data/Instructors.json';

const InstructorMain = () => {

    return (
        <>
            <div className="instructors___page pt---120 pb---140">
                <div className="container pb---60">                        
                    <div className="row">
                    {instructors.map((data, index) => {
                        return (
                        <div className="col-lg-3">
                            <div className="instructor__content">
                                <div className="instructor__image">
                                    <img src={require(`../../assets/images/instructor/${data.image}`)} alt={data.name} />
                                    <div className="content__hover">
                                        <p>{data.bio}</p>
                                        <ul>                                            
                                            <li><a href="https://www.facebook.com/"><span aria-hidden="true" className="social_facebook"></span></a></li>
                                            <li><a href="https://x.com/"><span aria-hidden="true" className="social_twitter"></span></a></li>
                                            <li><a href="https://lk.linkedin.com/"><span aria-hidden="true" className="social_linkedin"></span></a></li>
                                        </ul>
                                    </div>
                                </div>                                    
                                <div className="bottom-content"> 
                                    <h4><Link to={`/instructor/${data.id}`}>{data.name}</Link></h4>
                                    <p>{data.designation}</p>
                                </div>                                 
                            </div>
                        </div>
                        )
                        }).slice(0, 3)}
                    </div>
                </div>
            </div>   
        </>

    );
}


export default InstructorMain;