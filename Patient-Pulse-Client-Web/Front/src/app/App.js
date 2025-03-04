import React, { useState, useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import Preloader from "../components/Preloader";

//Custom Components



import Home from '../pages/home-3';
import About from '../pages/about';
import Course from '../pages/course';
import CourseList from '../pages/course/course-list';
import CourseDetails from '../pages/course/course-details';
import CourseSidebar from '../pages/course/course-sidebar';
import Patient from '../pages/profile/profile-details';
import Event from '../pages/event';
import EventSidebar from '../pages/event/event-sidebar';
import EventDetails from '../pages/event/event-details';
import Blog from '../pages/blog';
import Appointments from '../pages/Appointments/appointment-details';
import Login from '../pages/authentication/login';
import Signup from '../pages/authentication/signup';
import Contact from '../pages/contact';
import Error from '../pages/404';
import LoadTop from '../components/ScrollTop/LoadTop'


const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate data loading delay
        setTimeout(() => {
        setIsLoading(false);
        }, 800);
    }, []);

    return (
        <div className='App'>
            {isLoading ?
                <Preloader /> : ''
            }
            <>
                <LoadTop />
                <Routes>
                    
                    
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/course" exact element={<Course />} />
                    <Route path="/course-list" exact element={<CourseList />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/course-sidebar" element={<CourseSidebar />} />
                    <Route path="/event" exact element={<Event />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                    <Route path="/event-sidebar" element={<EventSidebar />} />
                    <Route path="/blog" exact element={<Blog />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/profile" exact element={<Patient />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </>
        </div>
    );
}

export default App;
