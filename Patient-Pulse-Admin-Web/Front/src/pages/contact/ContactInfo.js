import React from 'react';


import infoImg1 from '../../assets/images/contact/2.png'
import infoImg2 from '../../assets/images/contact/3.png'
import infoImg3 from '../../assets/images/contact/4.png'

const ContactInfo = (props) => {
    const { contactBoxClass } = props;
    return (
        <ul className="address-sec">
            <li>
                <em className="icon"><img src={infoImg1} alt="image" /></em>
                <span className="text"><em>Address</em> Ranawiru Wasantha Lankathilaka<br/>Mawatha, Duwa Road,<br/>Panadura </span>
            </li>
            <li>
                <em className="icon"><img src={infoImg2} alt="image" /></em>
                <span className="text"><em>Contact</em> <a href="tel:+(94)766474436">Mobile: +(94) 76 647 4436</a> <a href="mailto:patientpulseinfo@gmail.com">Mail: patientpulseinfo@gmail.com</a></span>
            </li>
            <li>
                <em className="icon"><img src={infoImg3} alt="image" /></em>
                <span className="text"><em>Hour of Open</em> Monday - Friday: 16:00 - 21:00 <br/>Saturday: 10:30 - 16:00 <br/>Sunday & Poya Day: Closed</span>
            </li>
        </ul>
    );

}

export default ContactInfo;