import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap';
import UserInfo from "./UserInfo";
import UserCalendar from "./UserCalendar";

const axios = require('axios');

class UserView extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     userData: {}
        // };
    }

    // componentDidMount() {
    //     // Retrieve user data
    //     this.setState({
    //         userData: this.props.userData
    //     })
    // }

    render() {
        if (!this.props.isAuthenticated) {
            console.log("User cannot access user data -> not logged in");
            return <Redirect to="/login" />
        }

        return (
            <Container>
                <Row>
                    <Col lg={8}>
                        <UserInfo username={this.props.userData.username} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={10}>
                        <UserCalendar
                            sections={this.props.userData.sections}
                            handleDelete={(sectionId) => this.props.handleDelete(sectionId)}
                        />
                    </Col>
                </Row>
                <Button onClick={this.props.handleLogout}>Logout</Button>
            </Container>
        )
    }
}

export default UserView