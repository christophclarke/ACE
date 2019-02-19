import React, { Component } from 'react';
import Bubble from './Bubble'

const axios = require('axios');


class DepartmentList extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            search: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const url = "http://localhost:8000/api/departments/"

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
            (department) => {
                return department['full_name'].toUpperCase().includes(this.state.search.toUpperCase())
                || department['abbreviation'].toUpperCase().includes(this.state.search.toUpperCase())
            }
        )

        const result = filteredData.map((entry, index) => {
            return <Bubble
                        key={index}
                        data={entry}
                    />;
        });

        return (
            <div>
                <h1 className="search-header">Department Search</h1>
                <input 
                    className="search-bar"
                    placeholder="Computer Science"
                    type="text"
                    value={this.state.search}
                    onChange={this.handleChange}
                />
                <div className="bubble-container">{result}</div>
            </div>
        );
    }
}

export default DepartmentList;