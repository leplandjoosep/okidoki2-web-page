import React, {} from "react";
import axios from "axios";
import {AuthContext} from "./AuthContext";
//import crypto from "crypt";
// import {Link} from "react-router-dom";

const api = axios.create({
    baseURL: "http://okidoki2.hopto.org/api"
    // baseURL: "http://localhost:8080/api"
    // baseURL: "http://127.0.0.1:8080/api"
})

class Signup extends React.Component {

    static contextType = AuthContext;

    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            emailError: "",
            firstNameError: "",
            lastNameError: "",
            passwordError: "",
            confirmPasswordError: "",
        };
    }

    setFName = (event) => {
        const firstName = event.target.value;
        this.setState({ firstName });

        // Clear error if user starts typing
        if (firstName.trim()) {
            this.setState({ firstNameError: "" });
        }
    };

    setLName = (event) => {
        const lastName = event.target.value;
        this.setState({ lastName });

        // Clear error if user starts typing
        if (lastName.trim()) {
            this.setState({ lastNameError: "" });
        }
    };

    setPassword = (event) => {
        const password = event.target.value;
        this.setState({ password });

        // Clear password errors if user starts typing
        if (password) {
            this.setState({ passwordError: "" });
            if (this.state.confirmPassword === password) {
                this.setState({ confirmPasswordError: "" });
            }
        }
    };

    setConfirmPassword = (event) => {
        const confirmPassword = event.target.value;
        this.setState({ confirmPassword });

        // Clear confirm password error if user starts typing
        if (confirmPassword === this.state.password) {
            this.setState({ confirmPasswordError: "" });
        }
    };

    setEmail = (event) => {
        const email = event.target.value;
        this.setState({ email });

        // Simple email regex for basic validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            this.setState({ emailError: "Invalid email format" });
        } else {
            this.setState({ emailError: "" });
        }
    };

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    createUser = async (event) => {
        event.preventDefault();
        let valid = true;

        // Reset error messages
        this.setState({
            firstNameError: "",
            lastNameError: "",
            emailError: "",
            passwordError: "",
            confirmPasswordError: ""
        });

        // Validate first name
        if (!this.state.firstName.trim()) {
            this.setState({ firstNameError: "First name is required" });
            valid = false;
        }

        // Validate last name
        if (!this.state.lastName.trim()) {
            this.setState({ lastNameError: "Last name is required" });
            valid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.state.email || !emailRegex.test(this.state.email)) {
            this.setState({ emailError: "Invalid email format" });
            valid = false;
        }

        // Validate password
        if (!this.state.password) {
            this.setState({ passwordError: "Password is required" });
            valid = false;
        }

        // Validate confirm password
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ confirmPasswordError: "Passwords do not match" });
            valid = false;
        }

        if (valid) {
            try {
                const capitalizedFirstName = this.capitalizeFirstLetter(this.state.firstName);
                const capitalizedLastName = this.capitalizeFirstLetter(this.state.lastName);
                const checkEmail = await api.get(`/public/email/${this.state.email}`)
                if (checkEmail.data) {
                    const response = await api.post('/public/user', {
                        firstName: capitalizedFirstName,
                        lastName: capitalizedLastName,
                        email: this.state.email,
                        password: this.state.password
                    });

                    const token = response.data.token;


                    this.context.logIn(token);
                    localStorage.setItem("token", token);

                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

                    window.location.href = './get-users';
                } else {
                    this.setState({ emailError: "Email already in use" });
                    valid = false
                }
            } catch (error) {
                console.error('Authentication failed: ', error);
            }
        }
    }



    render() {
        return (
            <div className="formContainer">
                <div className="titleContainer">
                    <div>Sign Up</div>
                </div>
                <div className="form-group">
                    <label htmlFor="FirstName">First Name</label>
                    <input
                        type="text"
                        value={this.state.firstName}
                        placeholder={"Enter your first name"}
                        onChange={this.setFName}
                        className={"inputBox"}
                    />
                    {this.state.firstNameError && <p style={{ color: "red" }}>{this.state.firstNameError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="LastName">Last Name</label>
                    <input
                        type="text"
                        value={this.state.lastName}
                        placeholder={"Enter your last name"}
                        onChange={this.setLName}
                        className={"inputBox"}
                    />
                    {this.state.lastNameError && <p style={{ color: "red" }}>{this.state.lastNameError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        value={this.state.email}
                        placeholder={"Enter your email here"}
                        onChange={this.setEmail}
                        className={"inputBox"}
                    />
                    {this.state.emailError && <p style={{ color: "red" }}>{this.state.emailError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={this.state.password}
                        placeholder={"Enter your password here"}
                        onChange={this.setPassword}
                        className={"inputBox"}
                    />
                    {this.state.passwordError && <p style={{ color: "red" }}>{this.state.passwordError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="ConfirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        value={this.state.confirmPassword}
                        placeholder={"Enter your password again here"}
                        onChange={this.setConfirmPassword}
                        className={"inputBox"}
                    />
                    {this.state.confirmPasswordError && <p style={{ color: "red" }}>{this.state.confirmPasswordError}</p>}
                </div>
                <div className={"inputContainer"}>
                    <button type="submit" className="submitButton" onClick={this.createUser}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default Signup;