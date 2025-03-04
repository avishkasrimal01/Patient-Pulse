import React from "react";

import galleryImg1 from '../../assets/images/gallery/img1.jpg'; // Add your gallery images here
import galleryImg2 from '../../assets/images/gallery/img2.jpg';
import galleryImg3 from '../../assets/images/gallery/img3.jpg';
import galleryImg4 from '../../assets/images/gallery/img4.jpg';
import galleryImg5 from '../../assets/images/gallery/img5.jpg';
import galleryImg6 from '../../assets/images/gallery/img6.jpg';

const Testimonial = () => {

    // Image array for the photo gallery
    const galleryImages = [
        { id: 1, src: galleryImg1, alt: "Gallery Image 1" },
        { id: 2, src: galleryImg2, alt: "Gallery Image 2" },
        { id: 3, src: galleryImg3, alt: "Gallery Image 3" },
        { id: 4, src: galleryImg4, alt: "Gallery Image 4" },
        { id: 5, src: galleryImg5, alt: "Gallery Image 5" },
        { id: 6, src: galleryImg6, alt: "Gallery Image 6" },
    ];

    return (
        <div className="react_populars_topics react_populars_topics2 react_populars_topics_about pb---80">
            <div className="react__title__section react__title__section-all">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s">Patient Pulse</h6>
                        <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.5s">Photo Gallery</h2>
                    </div>
                </div>

                {/* Photo Gallery */}
                <div className="gallery-grid">
                    {galleryImages.map((image) => (
                        <div key={image.id} className="gallery-item">
                            <img src={image.src} alt={image.alt} className="gallery-image" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Testimonial;
