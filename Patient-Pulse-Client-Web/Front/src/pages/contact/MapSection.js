import React from 'react';
import mapImg from '../../assets/images/contact/1.jpg';

const Map = (props) => {
    return (
        <div className="react-contacts pt-106"> 
            <div className="react-image-maping">
                

                {/* Google Maps iframe */}
                <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3585.658576822911!2d79.91893467448168!3d6.73544702066512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae24f13b60d4e3d%3A0x7997d03fca32607!2sRupasingha%20Ayurvedic%20Medical%20Center!5e1!3m2!1sen!2slk!4v1728026642951!5m2!1sen!2slk"
                    width="100%"
                    height="600"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div> 
    );
}

export default Map;
