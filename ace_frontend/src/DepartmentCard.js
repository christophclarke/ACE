import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
// import Collapse from 'react-bootstrap/Collapse'
import {Link} from "react-router-dom";


const axios = require('axios');

class DepartmentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: this.props.url,
            isExpanded: false,
            data: this.props.data,
            courses: []
        };
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        // Get course data for this department
        const url = `${this.state.apiUrl}/departments/${this.state.data['abbreviation']}/courses`;
        axios.get(url)
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

    handleClick(event) {
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }

    render() {
        return (
            <Card className={"shadowed-hover"}>
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
                </Card.Body>
            </Card>
        )
    }
}

export default DepartmentCard