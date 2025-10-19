import React from "react";
import axios from "axios";
import {AuthContext} from "./AuthContext";

const api = axios.create({
    baseURL: "http://okidoki2.hopto.org/api"
    // baseURL: "http://localhost:8080/api"
})

class Login extends React.Component {
    static contextType = AuthContext; // Access AuthContext

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            authError: "" // New error state
        };
    }

    setEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    setPassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };

    login = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/public/login', {
                email: this.state.email,
                password: this.state.password
            });

            const token = response.data.token;
            this.context.logIn(token); // Update login state using AuthContext

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

            window.location.href = './store';
        } catch (error) {
            console.error('Authentication failed: ', error);
            this.setState({ authError: "Incorrect username or password" }); // Set error message
        }
    }

    toSignUp = (event) => {
        window.location.href = './sign-up';
    }

    render() {
        return (
            <div className="formContainer">
                <div className="titleContainer">
                    <div>Login2</div>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        value={this.state.email}
                        placeholder={"Enter your email here"}
                        onChange={this.setEmail}
                        className={"inputBox"}/>
                </div>
                <div className="form-group">
                    <label hmtlFor="password">Password</label>
                    <input
                        type="password"
                        value={this.state.password}
                        placeholder={"Enter your password here"}
                        onChange={ this.setPassword }
                        className={"inputBox"}/>
                </div>
                {this.state.authError && <p style={{ color: "red", textAlign: "center" }}>{this.state.authError}</p>} {/* Display error message */}

                <div className={"inputContainer"}>
                    <button type="submit" className="submitButton" onClick={this.login}>Log in</button>
                    <br />
                    <button type="submit" className="submitButton" onClick={this.toSignUp}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default Login;