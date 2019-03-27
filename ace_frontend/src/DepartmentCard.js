import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
// import Collapse from 'react-bootstrap/Collapse'
import { Link } from "react-router-dom";


const axios = require('axios');

class DepartmentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: this.props.url,
            isExpanded: false,
            data: this.props.data,
            courses: []
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        const url = `${this.state.apiUrl}/departments/${this.state.data['abbreviation']}/courses`
        axios.get(url)
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

    elementClass = "card";

    handleClick(event) {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }

    render() {
        const info = this.state.courses.map((entry, index) => {
            return (
                <li key={index}>
                    {entry['course_number']}
                </li>
            )
        });

        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        <Link to={"/search/" + this.props.data['abbreviation']}>
                            {this.props.data['abbreviation']}
                        </Link>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {this.props.data['full_name']}
                    </Card.Subtitle>
                    <Card.Text>
                        {this.state.courses.length} Courses
                    </Card.Text>
                    {/* <ul className={classes.join(' ')}>{info}</ul> */}
                    {/* <Collapse in={this.state.isExpanded}>
                        <div id="example-collapse-text">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                            terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                            labore wes anderson cred nesciunt sapiente ea proident.
                        </div>
                    </Collapse> */}
                </Card.Body>
                {/* <Card.Footer>
                    <big onClick={this.handleClick}
                        aria-controls="example-collapse-text"
                        aria-expanded={this.state.isExpanded}
                    >
                        {this.state.isExpanded ? "-" : "+"}
                    </big>
                </Card.Footer> */}
            </Card>
        )
    }
}

export default DepartmentCard