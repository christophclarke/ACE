import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CourseList from './CourseList';

const axios = require('axios');

class DepartmentFull extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dept: this.props.match.params.department,
            apiUrl: "http://ec2-3-17-67-110.us-east-2.compute.amazonaws.com:8000/api",
            departmentData: {},
            courses: []
        }
    }

    componentDidMount() {
        const departmentUrl = `${this.state.apiUrl}/departments/${this.state.dept}`;
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

        const coursesUrl = `${this.state.apiUrl}/departments/${this.state.dept}/courses`;
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
                <Link to="/departments">Go Back</Link>
                <CourseList url={this.state.apiUrl + "/departments/" + this.state.dept} dept={this.state.dept}/>
            </div>
        )
    }
}

export default DepartmentFull