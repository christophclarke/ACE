import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


const axios = require('axios');

class CourseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            data: this.props.data,
            sections: []
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        const url = `${this.props.url}/departments/${this.props.department}/courses/${this.props.data['course_number']}/sections/`
        axios.get(url)
            .then((response) => {
                const data = response.data
                data.sort((a, b) => {
                    return a['section_number'] - b['section_number'];
                })
                this.setState({
                    sections: data
                })
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

    elementClass = "card";

    handleClick(event) {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }

    render() {
        const info = this.state.sections.map((entry, index) => {
            return (
                <li key={entry['section_number']}>
                    {`${entry['section_number']} | ${entry['instructor']}`}
                </li>
            )
        });

        let classes;
        if (!this.state.isExpanded) {
            classes = ['additional', 'additional-hidden']
        } else {
            classes = ['additional']
        }

        return (
            <Card>
                <Card.Header as="h4">
                    <Link to={`/${this.props.data['department']}/${this.props.data['course_number']}`}>
                        {this.props.data['course_number']}
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        {this.props.data['course_title']}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">

                    </Card.Subtitle>
                    <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                    </Card.Text>
                    {/* <ul className={classes.join(' ')}>{info}</ul> */}
                    <Collapse in={this.state.isExpanded}>
                        <div id="example-collapse-text">
                            <ul className={classes.join(' ')}>{info}</ul>
                        </div>
                    </Collapse>
                </Card.Body>
                <Card.Footer>
                    <big onClick={this.handleClick}
                        aria-controls="example-collapse-text"
                        aria-expanded={this.state.isExpanded}
                    >
                        {this.state.isExpanded ? "-" : "+"}
                    </big>
                </Card.Footer>
            </Card>
        )
    }
}

export default CourseCard