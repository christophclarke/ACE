import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CourseBubble from './CourseCard.js'
// import DepartmentFull from './DepartmentFull';

const axios = require('axios');


class CourseList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apiUrl: this.props.url,
            data: [],
            search: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const url = this.state.apiUrl + "/courses/"

        axios.get(url)
            .then((response) => {
                const data = response.data
                this.setState({
                    data: data
                })
                console.log(response);
                console.log(this.state.data)
            })
            .catch(function (error) {
                // handle error
                console.log("Requested: " + url)
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    handleChange(event) {
        this.setState({
            search: event.target.value
        })
    }

    render() {
        let filteredData = this.state.data.filter(
            (course) => {
                return `${course['department']} ${course['course_number']}`.toUpperCase().includes(this.state.search.toUpperCase())
                || course['course_title'].toUpperCase().includes(this.state.search.toUpperCase())
            }
        )

        const result = filteredData.map((entry, index) => {
            return <CourseBubble
                        apiUrl={this.state.apiUrl}
                        key={index}
                        data={entry}
                    />;
        });

        return (
            <div>
                <h1 className="search-header">{this.props.dept} Search</h1>
                <input 
                    className="search-bar"
                    placeholder="1204"
                    type="text"
                    value={this.state.search}
                    onChange={this.handleChange}
                    autofocus="true"
                />
                <div className="bubble-container">{result}</div>
            </div>
        );
    }
}

export default CourseList;