import React from 'react';
import {Link, Redirect} from 'react-router-dom'

const axios = require('axios');

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    onSubmit = e => {
        e.preventDefault();
        const url = `${this.props.url}auth/login/`;
        axios.post(url, {
            "username" : this.state.username,
            "password" : this.state.password
            })
            .then((response) => {
                console.log(response);
                localStorage.setItem("token", response.data.token);
                console.log("Local Token " + localStorage.getItem("token"));
                this.props.authHandle(true, response.data.user);
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.status === 400) {
                    alert("Username and/or password are incorrect!")
                }
            })
            .then(function () {
                // always executed
            });
    };

    render() {
        if (this.props.isAuthenticated) {
            console.log("already logged in");
            return <Redirect to="/" />
        }
        return (
            <form onSubmit={this.onSubmit}>
                <fieldset>
                    <legend>Login</legend>
                    <p>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text" id="username"
                            onChange={e => this.setState({ username: e.target.value })} />
                    </p>
                    <p>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password" id="password"
                            onChange={e => this.setState({ password: e.target.value })} />
                    </p>
                    <p>
                        <button type="submit">Login</button>
                    </p>

                    <p>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </fieldset>
            </form>
        )
    }
}

export default Login;