import React from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap';
import UserInfo from "./UserInfo";
import UserCalendar from "./UserCalendar";

const axios = require('axios');

const AppDataContext = new React.createContext();

class UserView extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     userData: {}
        // };
        this.logout = this.logout.bind(this);
    }

    // componentDidMount() {
    //     // Retrieve user data
    //     this.setState({
    //         userData: this.props.userData
    //     })
    // }

    logout() {
        const url = `${this.props.url}auth/logout/`;
        console.log("logging out on " + url);
        axios.post(url, {}, {
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
            .then((response) => {
                console.log("logout success");
                console.log(response);
                console.log("removing token from localstorage");
                localStorage.removeItem('token');
                this.props.authHandle(false, {})
            })
            .catch((function (error) {
                console.log("error logging out");
                console.log(error.response)
            }))
    }

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
                        <UserCalendar sections={this.props.userData.sections}/>
                    </Col>
                </Row>
                <Button onClick={this.logout}>Logout</Button>
            </Container>
        )
    }
}

export default UserView