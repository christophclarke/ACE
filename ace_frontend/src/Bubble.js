import React, { Component } from 'react';

const axios = require('axios');

class Bubble extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            data: this.props.data,
            courses: []
        }
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        const url = `http://localhost:8000/api/departments/${this.state.data['abbreviation']}/courses`
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

    elementClass = "card"

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

        let classes;
        if (!this.state.isExpanded) {
            classes = ['additional', 'additional-hidden']
        } else {
            classes = ['additional']
        }

        return (
            <div>
                <div className="card">
                    <div className="container">
                        <h4>{this.props.data['abbreviation']}</h4>
                        <p>{this.props.data['full_name']}</p>
                        <h5 onClick={this.handleClick}>{this.state.isExpanded ? "-" : "+"}</h5>
                        <ul className={classes.join(' ')}>{info}</ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Bubble