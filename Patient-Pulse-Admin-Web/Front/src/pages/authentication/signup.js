import React from 'react';
import SignupMain from './SignupMain';
import ScrollToTop from '../../components/ScrollTop';



const Signup = () => {

    return (
        <>

            <div class="react-wrapper">
                <div class="react-wrapper-inner">

                    <SignupMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>
        </>
    );
}


export default Signup;

