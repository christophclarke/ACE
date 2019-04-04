import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";

const axios = require('axios');

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    onSubmit = e => {
        e.preventDefault();
        const url = `${this.props.url}auth/register/`;
        axios.post(url, {
            "username" : this.state.username,
            "password" : this.state.password
            })
            .then((response) => {
                console.log(response);
                localStorage.setItem("token", response.data.token);
                console.log("Local Token " + localStorage.getItem("token"));
                this.props.authHandle(true, response.data.user);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <Container>
                <Row className={'mt-5'}>
                    <Col sm={{span: 6, offset: 3}}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Register For ACE</h2>
                                </Card.Title>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            name="username"
                                            type="text"
                                            placeholder="Enter username"
                                            onChange={e => this.setState({username: e.target.value})}
                                        />
                                        {/*<Form.Text className="text-muted">*/}
                                        {/*    We'll never share your email with anyone else.*/}
                                        {/*</Form.Text>*/}
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            onChange={e => this.setState({password: e.target.value})}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Sign Up
                                    </Button>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                Already have an account? <Link to="/login">Register</Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Register