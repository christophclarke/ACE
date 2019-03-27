import React from 'react'
import {Redirect} from 'react-router-dom'

const axios = require('axios')

class UserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        }
    }

    componentDidMount() {
        // Retrieve user data
        const url = `${this.props.url}/auth/user/`
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

    render() {

        if (!this.props.isAuthenticated) {
            console.log("User cannot access user data -> not logged in")
            return <Redirect to="/login" />
        }

        return (
            JSON.stringify(this.state.userData)
        )
    }
}

export default UserView