import React, {Component} from 'react';
import Home from './Home'
import DepartmentSearch from './DepartmentSearch'
import DepartmentDescription from './DepartmentDescription'
import AceNav from './AceNav'
import UserView from './UserView'
import Login from './Login'
import Register from './Register'
import {Route, Switch} from "react-router-dom";
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "/api/",
            isAuthenticated: !!localStorage.getItem('token'),
            userData: {}
        };

        console.log(this.state);
        console.log("local storage token: " + localStorage.getItem('token'));
        this.updateAuth = this.updateAuth.bind(this);
        this.getUser = this.getUser.bind(this);
        this.addSection = this.addSection.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.getUser()
    }

    updateAuth(newIsAuth, data) {
        console.log(`updating auth to iA: ${newIsAuth} user: ${data.username}`);
        this.setState({
            isAuthenticated: newIsAuth,
            userData: newIsAuth ? data : {},
        });

        if (!newIsAuth) {
            localStorage.removeItem('token');
        }
    }

    getUser() {
        if (!this.state.isAuthenticated) {
            console.log("Not Authed");
            this.setState({
                isAuthenticated: false,
                userData: {}
            });
            return;
        }

        console.log("requesting user");
        let url = `${this.state.url}auth/user/`;
        axios.get(url, {
            headers: {
                "authorization": "Token " + localStorage.getItem('token')
            }
        }).then((response) => {
            console.log("user request response received");
            console.log(response);
            const uData = response.data;
            const secData = response.data.sections.map((sectionId) => {
                console.log("Requesting data for section " + sectionId);
                let url = `${this.state.url}/sections/${sectionId}/`;
                return axios.get(url, {
                    headers: {
                        "authorization": "Token " + localStorage.getItem('token')
                    }
                })
            });
            axios.all(secData).then((something) => {
                console.log("something came back");
                uData.sections = something.map((val) => {
                    return val.data;
                });
                this.updateAuth(true, uData);
            })
        }).catch((e) => {
            console.log("user request failed, updating state to not authorized");
            console.log(e);
            this.updateAuth(false, {});
        }).then(function () {
            // always executed
        });
    }

    logout() {
        const url = `${this.state.url}auth/logout/`;
        console.log("logging out on " + url);
        axios.post(url, {}, {
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then((response) => {
            console.log("logout success");
            console.log(response);
            console.log("removing token from localstorage");
            localStorage.removeItem('token');
            this.updateAuth(false, {})
        }).catch((function (error) {
            console.log("error logging out");
            console.log(error.response)
        }))
    }

    addSection(sectionNumber) {
        console.log("adding " + sectionNumber);
        const userUrl = `${this.state.url}users/${this.state.userData.id}/`;
        if (!this.state.userData) return;
        // Get the current section data for the user
        let sectionNums = this.state.userData.sections.map((value, index) => {
            return value.id;
        });
        console.log(sectionNums);
        // Add the new section number
        sectionNums.push(sectionNumber);
        console.log(sectionNumber);
        axios.patch(userUrl, {
            "sections": sectionNums
        }, {
            headers: {
                "authorization": "Token " + localStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Successfully patched user data");
            console.log(response);
            this.getUser()
        }).catch((error) => {
            console.log("Error while adding section");
            console.log(error.response)
        })
    }

    deleteSection(sectionNumber) {
        console.log("deleting" + sectionNumber);
        const userUrl = `${this.state.url}users/${this.state.userData.id}/`;
        if (!this.state.userData) return;
        let sectionNums = this.state.userData.sections.map((value, index) => {
            return value.id;
        });
        console.log(sectionNums);
        sectionNums = sectionNums.filter(e => e !== sectionNumber);
        console.log(sectionNumber);
        axios.patch(userUrl, {
            "sections": sectionNums
        }, {
            headers: {
                "authorization": "Token " + localStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Successfully patched user data");
            console.log(response);
            this.getUser()
        }).catch((error) => {
            console.log("Error while deleting section");
            console.log(error.response)
        })
    }

    render() {
        return (
            <div id="app-container">
                <AceNav username={this.state.userData.username}/>
                <Switch>
                    {/* The route to the home page */}
                    <Route exact path="/" component={Home}/>

                    {/* Login Route */}
                    <Route
                        path="/login"
                        render={props => <Login {...props}
                                                url={this.state.url}
                                                isAuthenticated={this.state.isAuthenticated}
                                                authHandle={this.updateAuth}/>}
                    />

                    {/* Register Path */}
                    <Route
                        path="/register"
                        render={props => <Register {...props}
                                                   url={this.state.url}
                                                   isAuthenticated={this.state.isAuthenticated}
                                                   authHandle={this.updateAuth}/>}
                    />

                    {/* Route to user data */}
                    <Route
                        path="/me"
                        render={props => <UserView {...props}
                                                   url={this.state.url}
                                                   isAuthenticated={this.state.isAuthenticated}
                                                   authHandle={this.updateAuth}
                                                   userData={this.state.userData}
                                                   handleDelete={(sectionId) => this.deleteSection(sectionId)}
                                                   handleLogout={this.logout}
                        />}
                    />

                    {/* The route to the department search */}
                    <Route exact path="/search/departments"
                           render={props => <DepartmentSearch {...props}
                                                              url={this.state.url}
                                                              isAuthenticated={this.state.isAuthenticated}/>}
                    />

                    {/* The route to the department description (and further nested resources */}
                    <Route
                        path="/search/:department"
                        render={props =>
                            <DepartmentDescription {...props}
                                                   isAuthenticated={this.state.isAuthenticated}
                                                   userData={this.state.userData}
                                                   url={this.state.url}
                                                   department={props.match.params.department}
                                                   handleSectionAdd={(sectionId) => this.addSection(sectionId)}
                            />
                        }
                    />
                </Switch>
            </div>
        )
    }
}

export default App;