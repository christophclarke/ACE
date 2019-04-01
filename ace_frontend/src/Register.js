import React from 'react'
import {Link, Redirect} from 'react-router-dom'

const axios = require('axios');

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    onSubmit = e => {
        e.preventDefault();
        const url = `${this.props.url}auth/register/`;
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
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <form onSubmit={this.onSubmit}>
                <fieldset>
                    <legend>Register</legend>
                    {/* {this.props.errors.length > 0 && (
                        <ul>
                            {this.props.errors.map(error => (
                                <li key={error.field}>{error.message}</li>
                            ))}
                        </ul>
                    )} */}
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
                        <button type="submit">Register</button>
                    </p>

                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </fieldset>
            </form>
        )
    }
}

export default Register