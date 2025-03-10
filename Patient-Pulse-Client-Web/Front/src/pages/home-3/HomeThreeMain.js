import React from 'react';
import About from './AboutSection';
import Topics from './TopicsSection';
import HomeBanner from './BannerSection';
import Video from './VideoSection';
import Testimonial from './TestimonialSection';
import ScrollToTop from '../../components/ScrollTop';

const HomeThreeMain =() => {
		return (
			<>
				<div className="react-wrapper">
            		<div className="react-wrapper-inner">
						{/* BannerSection-start */}
						<HomeBanner />
						{/* BannerSection-start */}

						{/* About-area-start */}
						<About />
						{/* About-area-end */}

						{/* Video-area-start */}
						<Video />
						{/* Video-area-end */}

						{/* Topics-area-start */}
						<Topics />
						{/* Topics-area-end */}

						{/* testmonial-area-start */}
						<Testimonial />
						{/* testmonial-area-end */}

						{/* scrolltop-start */}
						<ScrollToTop />
						{/* scrolltop-end */}
					</div>
				</div>

			</>
		);
	}

export default HomeThreeMain;