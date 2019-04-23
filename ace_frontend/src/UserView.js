import React from 'react'
import {Redirect} from 'react-router-dom'
import {Col, Container, Row} from 'react-bootstrap';
import UserInfo from "./UserInfo";
import UserCalendar from "./UserCalendar";

const axios = require('axios');

function UserView(props) {
    if (!props.isAuthenticated) {
        console.log("User cannot access user data -> not logged in");
        return <Redirect to="/login"/>
    }

    return (
        <Container className={'mt-5'}>
            <Row>
                <Col xs={4}>
                    <UserInfo
                        userData={props.userData}
                        handleLogout={props.handleLogout}
                        handleDelete={(sectionId) => props.handleDelete(sectionId)}
                    />
                </Col>
                <Col>
                    <UserCalendar
                        sections={props.userData.sections}
                        handleDelete={(sectionId) => props.handleDelete(sectionId)}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default UserView