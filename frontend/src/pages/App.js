import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar'; // Adjust the path as needed
import {AuthProvider} from './AuthContext'; // Adjust the path as needed
import SignUp from "./SignUp";
import GetUsers from "./GetUsers";
import Login from "./Login";
import StorePage from "./StorePage";
import AddProduct from "./AddProduct";
import ProfilePage from "./ProfilePage";
import '../css/App.css';

function App() {
    const authToken = localStorage.getItem('token');
    let isLoggedIn = false;
    if (authToken) {
        isLoggedIn = true;
    }

    useEffect(() => {
        document.title = "okidoki2";

        const link = document.createElement('link');
        const existingLink = document.querySelector("link[rel='icon']");
        link.rel = 'icon';
        link.href = 'tabicon.jpg';

        if (existingLink) {
            document.head.removeChild(existingLink);
        }

        document.head.appendChild(link);
    }, []);

    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/store" />} />
                    <Route path="/get-users" element={isLoggedIn ? <GetUsers /> : <Navigate to="/login" />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/store" />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/addproduct" element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />} />
                    <Route path="/myprofile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/store" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;