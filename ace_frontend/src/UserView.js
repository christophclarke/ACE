import React from 'react'
import {Redirect} from 'react-router-dom'
import {Button, Col, Container, Row} from 'react-bootstrap';
import UserInfo from "./UserInfo";
import UserCalendar from "./UserCalendar";

const axios = require('axios');

function UserView(props) {
    if (!props.isAuthenticated) {
        console.log("User cannot access user data -> not logged in");
        return <Redirect to="/login"/>
    }

    return (
        <Container>
            <Row>
                <Col sm={{span: 8, offset: 2}}>
                    <UserInfo username={props.userData.username} handleLogout={props.handleLogout}/>
                </Col>
            </Row>
            <Row>
                <Col sm={{span: 10, offset: 1}}>
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