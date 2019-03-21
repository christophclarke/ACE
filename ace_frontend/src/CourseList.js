import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CourseCard from './CourseCard.js'
// import DepartmentFull from './DepartmentFull';

const axios = require('axios');


class CourseList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            search: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const url = this.props.url + "/departments/" + this.props.department + "/courses/"

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
            return <CourseCard
                        url={this.props.url}
                        department={this.props.department}
                        key={index}
                        data={entry}
                    />;
        });

        return (
            <div>
                <h1 className="search-header">{this.props.department} Search</h1>
                <input 
                    className="search-bar"
                    placeholder="1204"
                    type="text"
                    value={this.state.search}
                    onChange={this.handleChange}
                    autoFocus={true}
                />
                <div className="bubble-container">{result}</div>
            </div>
        );
    }
}

export default CourseList;