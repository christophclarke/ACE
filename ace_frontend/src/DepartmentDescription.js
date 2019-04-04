import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from "react-router-dom";
import CourseSearch from './CourseSearch';
import CourseDescription from "./CourseDescription";
import axios from 'axios';
import {Container} from "react-bootstrap";

class DepartmentDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentData: {},
            courses: []
        }
    }

    componentDidMount() {
        const departmentUrl = `${this.props.url}/departments/${this.props.department}`;
        axios.get(departmentUrl)
            .then((response) => {
                const data = response.data;
                this.setState({
                    departmentData: data
                });
                console.log(response);
                console.log(this.state.data)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });

        const coursesUrl = `${departmentUrl}/courses`;
        axios.get(coursesUrl)
            .then((response) => {
                const data = response.data;
                this.setState({
                    courses: data
                });
                console.log(response);
                console.log(this.state.data)
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
            console.log("User cannot access user data -> not logged in");
            return <Redirect to="/login"/>
        }

        const info = this.state.courses.map((entry, index) => {
            return (
                <li key={index}>
                    {entry['course_number']} | {entry['course_title']}
                </li>
            )
        });

        return (
            <Container>
                <h1>{this.state.departmentData['full_name']}</h1>
                {/* <Link to="/departments">Go Back</Link> */}
                <Route exact path={this.props.match.url + "/"} render={(props)=> (
                    <CourseSearch url={this.props.url} department={this.props.department}/>
                )}/>
                <Route path={this.props.match.url + "/:course"} render={(props) =>
                    <CourseDescription
                        {...props}
                        userData={this.props.userData}
                        url={this.props.url}
                        department={this.props.department}
                        course={props.match.params.course}
                        handleSectionAdd={(sectionId) => this.props.handleSectionAdd(sectionId)}
                    />} />
            </Container>
        )
    }
}

export default DepartmentDescription