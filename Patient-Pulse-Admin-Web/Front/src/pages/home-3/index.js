import React from 'react';
import HomeThreeMain from './HomeThreeMain';
import Header from '../../components/Header';

import Logo from '../../assets/images/logos/logo2.png';

const HomeThree = () => {
    return (
        <>
            <Header
                parentMenu='home'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />
            <HomeThreeMain />
        </>
    );
}

export default HomeThree;
