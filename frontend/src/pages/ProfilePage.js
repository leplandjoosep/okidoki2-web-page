import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../css/App.css';
import '../css/Form.css';
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const api = axios.create({
    baseURL: "http://okidoki2.hopto.org/api"
    // baseURL: "http://localhost:8080/api"
})

const ProfilePage = () => {
    const {user} = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [originalFirstName, setOriginalFirstName] = useState('');
    const [originalLastName, setOriginalLastName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const authToken = localStorage.getItem('token');
                const decodedToken = jwtDecode(authToken);
                const ownerID = decodedToken.id;
                const response = await api.get(`/public/user/${ownerID}`);

                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);

                setOriginalFirstName(response.data.firstName);
                setOriginalLastName(response.data.lastName);
                setOriginalEmail(response.data.email);

                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error, e.g., redirect to login page
            }
        };

        getUser();
    }, [user]);

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    const validateForm = async () => {
        let isValid = true;

        if (!firstName.trim()) {
            setFirstNameError("First name cannot be empty.");
            isValid = false;
        } else {
            setFirstNameError('');
        }

        if (!lastName.trim()) {
            setLastNameError("Last name cannot be empty.");
            isValid = false;
        } else {
            setLastNameError('');
        }

        const emailCheck = await api.get(`/public/email/${email}`)
        const authToken = localStorage.getItem('token');
        const decodedToken = jwtDecode(authToken);
        const ownerID = decodedToken.id;
        const userCheck = await api.get(`/public/user/${ownerID}`)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim() || !emailRegex.test(email)) {
            setEmailError("Invalid email format.");
            isValid = false;
        } else if (!emailCheck.data && userCheck.data.email !== email) {
            setEmailError("Email is already in use");
            isValid = false;
        } else {
            setEmailError('');
        }

        const newPassword = document.getElementById("password").value;
        const confirmPassword = document.getElementById("newPassword").value;

        if (newPassword && newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            setConfirmPasswordError("Passwords do not match.");
            isValid = false;
        } else {
            setPasswordError('');
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFirstName(originalFirstName);
        setLastName(originalLastName);
        setEmail(originalEmail);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (!isValid) {
            console.error('Invalid form')
        } else {

            const authToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(authToken);
            const ownerID = decodedToken.id;
            if (!authToken) {
                console.error('Authentication token is missing.');
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            };

            const newPassword = e.target.elements.password.value;

            if (newPassword !== null && newPassword !== "") {

                const response1 = await api.put(`/user/${ownerID}`, {
                    firstName: capitalize(firstName),
                    lastName: capitalize(lastName),
                    email: email,
                    password: newPassword
                }, config);

                if (response1.status === 200) {
                    window.location.reload();
                }

            } else {
                const response2 = await api.put(`/user/${ownerID}`, {
                    firstName: capitalize(firstName),
                    lastName: capitalize(lastName),
                    email: email
                }, config);
                if (response2.status === 200) {
                    window.location.reload();
                }
            }
        }
    };


    return (
        <div className="profileContainer">
            <h1>Profile Information</h1>
            {!isEditing ? (
                <>
                    <div className="form-group">
                        <label>First Name</label>
                        <div className="inputDisplay">{firstName}</div>
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <div className="inputDisplay">{lastName}</div>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="inputDisplay">{email}</div>
                    </div>
                    <div className="inputContainer">
                        <button onClick={() => setIsEditing(true)} className="submitButton">Change Information</button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSaveChanges}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        {firstNameError && <p style={{ color: "red" }}>{firstNameError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
                        {lastNameError && <p style={{ color: "red" }}>{lastNameError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" />
                        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Confirm New Password</label>
                        <input type="password" id="newPassword" />
                        {confirmPasswordError && <p style={{ color: "red" }}>{confirmPasswordError}</p>}
                    </div>
                    <div className="inputContainer">
                        <button type="button" onClick={handleCancel} className="submitButton">Cancel</button>
                        <button type="submit" className="submitButton">Save Changes</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default ProfilePage;
