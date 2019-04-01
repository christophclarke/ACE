import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button } from 'react-bootstrap';

const axios = require('axios');

class UserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        // Retrieve user data
        const url = `${this.props.url}/auth/user/`;
        axios.get(url, {
            headers: {
                "authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((response) => {
                console.log(response);
                this.setState({
                    userData: response.data
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    logout() {
        const url = `${this.props.url}auth/logout/`;
        console.log("logging out on " + url);
        axios.post(url, {}, {
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((response) => {
                console.log("logout success");
                console.log(response);
                console.log("removing token from localstorage");
                localStorage.removeItem('token');
                this.props.authHandle(false, '')
            })
            .catch((function (error) {
                console.log("error logging out");
                console.log(error.response)
            }))
    }

    render() {

        if (!this.props.isAuthenticated) {
            console.log("User cannot access user data -> not logged in");
            return <Redirect to="/login" />
        }

        return (
            <div>
                {JSON.stringify(this.state.userData)}
                <Button onClick={this.logout}>Logout</Button>
            </div>
        )
    }
}

export default UserView