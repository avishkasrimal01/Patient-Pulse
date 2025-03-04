import React from 'react';
import Header from '../../components/Header';
import Breadcrumb from '../../components/Breadcrumb';
import InstructorDetailsMain from './ProfileDetailsMain';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';

const InstructorDetails = () => {

    return (
        <body className="profile-page">
            <Header
                parentMenu='page'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div class="react-wrapper">
                <div class="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Profile"
                    />

                    <InstructorDetailsMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

        </body>
    );
}


export default InstructorDetails;

