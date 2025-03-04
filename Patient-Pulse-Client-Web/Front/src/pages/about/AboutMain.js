import React from "react";

import AboutPart from './AboutSection'
import Testimonial from './TestimonialSection'
import Instructor from './InstructorSection'
import Feature from "./FeatureSection";

const AboutMain = () => {


    return (
        <>
            <AboutPart />

            <Feature />
            
            <Instructor />

            <Testimonial />
        </>
    )
}

export default AboutMain;