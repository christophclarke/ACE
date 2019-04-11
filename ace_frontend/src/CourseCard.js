import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import Collapse from 'react-bootstrap/Collapse'
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import moment from "moment";


const axios = require('axios');

class CourseCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            data: this.props.data,
            sections: []
        };
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        const url = `${this.props.url}/departments/${this.props.department}/courses/${this.props.data['course_number']}/sections/`;
        axios.get(url)
            .then((response) => {
                const data = response.data;
                data.sort((a, b) => {
                    return a['section_number'] - b['section_number'];
                });
                this.setState({
                    sections: data
                });
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
            var begin = moment(entry['time_begin'], "HH:mm:ss");
            var end = moment(entry['time_end'], "HH:mm:ss");
            return (
                <li key={entry['section_number']}>
                    {`${entry['section_number']} | ${entry['instructor']} \xa0\xa0\xa0\xa0`}
                    <span className="text-muted">
                        {entry['monday'] ? "M " : ""}
                        {entry['tuesday'] ? "T " : ""}
                        {entry['wednesday'] ? "W " : ""}
                        {entry['thursday'] ? "Th " : ""}
                        {entry['friday'] ? "F " : ""}
                        {entry['saturday'] ? "S " : ""}
                        &nbsp; @ &nbsp;
                        {begin.isValid() ? begin.format('LT') : "TBD"} - {end.isValid() ? end.format('LT') : "TBD"}
                    </span>
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
            <Card className={'shadowed-hover'}>
                <Card.Body>
                    <Card.Title className={"mb-3"} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>
                            <Link to={`/search/${this.props.data['department']}/${this.props.data['course_number']}`}>
                                {`${this.props.department} ${this.props.data['course_number']}`}
                            </Link>
                            &nbsp; | &nbsp;
                            {this.props.data['course_title']}
                        </span>

                        <span className={'text-muted'}>{this.props.data['credit_hours']} Credit Hours</span>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                    </Card.Subtitle>
                    <Card.Text>
                        {this.props.data['course_description']}
                    </Card.Text>
                    {/* <ul className={classes.join(' ')}>{info}</ul> */}
                    <Collapse in={this.state.isExpanded} className={'mt-3'}>
                        <div id="example-collapse-text">
                            <ul className={classes.join(' ')} style={{marginBottom: "0"}}>{info}</ul>
                        </div>
                    </Collapse>
                </Card.Body>
                <Card.Footer>
                    <big onClick={this.handleClick}
                         aria-controls="example-collapse-text"
                         aria-expanded={this.state.isExpanded}
                    >
                        {this.state.isExpanded ? "-" : "+"}
                        &nbsp;
                        <span className={'text-muted'} style={{fontSize: ".75em"}}>
                            {this.state.isExpanded ? "Less Info" : "More Info"}
                        </span>
                    </big>
                </Card.Footer>
            </Card>
        )
    }
}

export default CourseCard