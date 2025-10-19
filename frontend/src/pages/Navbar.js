import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../css/App.css';
import '../css/Navbar.css';

const Navbar = () => {
    const { isLoggedIn, logOut } = useContext(AuthContext);
    const login = () => {
        window.location.href = './login';
    };
    return (
        <nav className="navbar">
            <Link to="/store" className="nav-item">okidoki2</Link>
            {isLoggedIn ? (
                <>
                    <Link to="/addproduct" className="nav-button">Add Product</Link>
                    <Link to="/get-users" className="nav-button">View Users</Link>
                    <Link to="/myprofile" className="nav-button">My Profile</Link>
                    <button onClick={logOut} className="nav-button">Logout</button>
                </>
            ) : (
                <button onClick={login} className="nav-button">Login</button>
            )}
        </nav>
    );
};

export default Navbar;
