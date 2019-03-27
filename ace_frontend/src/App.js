import React, { Component } from 'react';
import Home from './Home'
import DepartmentList from './DepartmentList'
import DepartmentDescription from './DepartmentDescription'
import AceNav from './AceNav'
import UserView from './UserView'
import Login from './Login'
import Register from './Register'
import { Route, Switch } from "react-router-dom";

const axios = require('axios')
class App extends Component {
    constructor(props) {
        super(props)
        this.updateAuth = this.updateAuth.bind(this)
        this.getUser = this.getUser.bind(this)
        this.state = {
            url: "/api/",
            isAuthenticated: localStorage.getItem('token') ? true : false,
            username: ''
        }
        console.log(this.state)
        console.log(localStorage.getItem('token'))
    }

    componentDidMount() {
        this.getUser()
    }

    updateAuth(updatedState, username) {
        this.setState({
            isAuthenticated: updatedState,
            username: username
        });
    }

    getUser() {
        if (!this.state.isAuthenticated) {
            console.log("Not Authed")
            this.setState({
                username: ''
            });
            return;
        }

        let url = `${this.state.url}auth/user/`
        axios.get(url, {
            headers: {
                "authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((response) => {
                console.log(response);
                this.updateAuth(true, response.data.username);
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
        return (
            <div id="app-container">
                <AceNav username={this.state.username} />
                <Switch>
                    {/* The route to the home page */}
                    <Route exact path="/" component={Home} />

                    {/* Login Route */}
                    <Route
                        path="/login"
                        render={props => <Login {...props} url={this.state.url} isAuthenticated={this.state.isAuthenticated} authHandle={this.updateAuth} />}
                    />

                    <Route
                        path="/register"
                        render={props => <Register {...props} url={this.state.url} isAuthenticated={this.state.isAuthenticated} authHandle={this.updateAuth} />}
                    />

                    {/* Route to user data */}
                    <Route
                        path="/me"
                        render={props => <UserView {...props} url={this.state.url} isAuthenticated={this.state.isAuthenticated} />}
                    />

                    {/* The route to the department search */}
                    <Route exact path="/search/departments" render={props => <DepartmentList {...props} url={this.state.url} />} />

                    {/* The route to a specific course section */}
                    {/* <Route path="/:department/:course/:section" render={(props) => 
                        <p>{props.match.params.course + " Section " + props.match.params.section}</p>
                    } /> */}

                    {/* <Route path="/:department/:course" render={(props) => <p>{props.match.params.course}</p>} /> */}

                    <Route
                        path="/search/:department"
                        render={props => <DepartmentDescription {...props} url={this.state.url} department={props.match.params.department} />}
                    />
                </Switch>
            </div>
        )
    }
}

export default App;