import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CourseList from './CourseList';

const axios = require('axios');

class DepartmentDescription extends Component {
    constructor(props) {
        super(props)
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
                })
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
                const data = response.data
                this.setState({
                    courses: data
                })
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
        const info = this.state.courses.map((entry, index) => {
            return (
                <li key={index}>
                    {entry['course_number']} | {entry['course_title']}
                </li>
            )
        });

        return (
            <div className="container">
                <h1>{this.state.departmentData['full_name']}</h1>
                {/* <Link to="/departments">Go Back</Link> */}
                <Route exact path={this.props.match.url + "/"} render={(props)=> (
                    <CourseList url={this.props.url} department={this.props.department}/>
                )}/>
                <Route path={this.props.match.url + "/:course"} render={(props) => <p>{props.match.params.course}</p>} />
            </div>
        )
    }
}

export default DepartmentDescription