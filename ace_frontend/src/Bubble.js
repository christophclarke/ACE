import React, { Component } from 'react';

class Bubble extends Component {
    state = {
        data: []
    }

    render() {
        const { data } = this.props

        return (
            <div className="card">
                <div className="container">
                    <h4>{data['abbreviation']}</h4>
                    <p>{data['full_name']}</p>
                </div>
            </div>
        )
    }
}

export default Bubble