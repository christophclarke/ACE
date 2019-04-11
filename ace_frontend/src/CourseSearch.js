import React, {Component} from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import CourseCard from './CourseCard.js'
import {Col, Form} from "react-bootstrap";
// import DepartmentFull from './DepartmentFull';

const axios = require('axios');


class CourseSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            search: "",
            onlyNonConflict: false,
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    componentDidMount() {
        const url = this.props.url + "/departments/" + this.props.department + "/courses/";

        axios.get(url)
            .then((response) => {
                const data = response.data;
                this.setState({
                    data: data
                });
                console.log(response);
                console.log(this.state.data)
            })
            .catch(function (error) {
                // handle error
                console.log("Requested: " + url);
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    handleSearchChange(event) {
        this.setState({
            search: event.target.value
        })
    }

    handleCheckChange(event) {
        console.log("Checkbox Modified");
        console.log(event.target.checked);
        this.setState({
            onlyNonConflict: event.target.checked
        })
    }

    // sectionsConfilct()

    render() {
        let filteredData = this.state.data.filter(
            (course) => {
                return `${course['department']} ${course['course_number']}`.toUpperCase().includes(this.state.search.toUpperCase())
                    || course['course_title'].toUpperCase().includes(this.state.search.toUpperCase())
            }
        );

        // if (this.state.onlyNonConflict) {
        //     filteredData = filteredData.filter(
        //         (course) => {
        //             return
        //         }
        //     )
        // }

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
                <h1 className="search-header-left">{this.props.department} Search</h1>
                <Form>
                    <Form.Row>
                        <Col>
                            <input
                                className="search-bar-left"
                                placeholder="1204"
                                type="text"
                                value={this.state.search}
                                onChange={this.handleSearchChange}
                                autoFocus={true}
                            />
                        </Col>
                        <Col>
                            <Form.Check
                                inline
                                label="Only Show Courses Which Don't Conflict"
                                type={'checkbox'}
                                id={'custom-inline-checkbox-1'}
                                style={{margin: '25px 0'}}
                                onChange={this.handleCheckChange}
                            >
                            </Form.Check>
                        </Col>
                    </Form.Row>
                </Form>
                <div className="bubble-container-left">{result.length > 0 ? result : "No Courses Found"}</div>
            </div>
        );
    }
}

export default CourseSearch;