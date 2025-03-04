import React from 'react';
import LoginMain from './LoginMain';
import ScrollToTop from '../../components/ScrollTop';


const Login = () => {
    return (
        <>

            <div class="react-wrapper">
                <div class="react-wrapper-inner">

                    <LoginMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

        </>
    );
}


export default Login;

