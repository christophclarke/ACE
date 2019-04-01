import React, {Component} from 'react';
import {Card} from 'react-bootstrap'

class UserInfo extends Component {
    render() {
        return (
            <div>
                <Card body><h2>{this.props.username}</h2></Card>
            </div>
        );
    }
}

export default UserInfo;