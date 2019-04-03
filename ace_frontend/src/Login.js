import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap'

const axios = require('axios');

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const url = `${this.props.url}auth/login/`;
        axios.post(url, {
            "username": this.state.username,
            "password": this.state.password
        })
            .then((response) => {
                console.log(response);
                localStorage.setItem("token", response.data.token);
                console.log("Local Token " + localStorage.getItem("token"));
                this.props.authHandle(true, response.data.user);
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.status === 400) {
                    alert("Username and/or password are incorrect!")
                }
            })
            .then(function () {
                // always executed
            });
    };

    render() {
        if (this.props.isAuthenticated) {
            console.log("already logged in");
            return <Redirect to="/me"/>
        }
        return (
            <Container>
                <Row>
                    <Col lg={8}>
                        <Card className={'mt-5'}>
                            <Card.Body>
                                {/*<form onSubmit={this.onSubmit}>*/}
                                {/*    <fieldset>*/}
                                {/*        <legend>Login</legend>*/}
                                {/*        <p>*/}
                                {/*            <label htmlFor="username">Username</label>*/}
                                {/*            <input*/}
                                {/*                type="text" id="username"*/}
                                {/*                onChange={e => this.setState({username: e.target.value})}/>*/}
                                {/*        </p>*/}
                                {/*        <p>*/}
                                {/*            <label htmlFor="password">Password</label>*/}
                                {/*            <input*/}
                                {/*                type="password" id="password"*/}
                                {/*                onChange={e => this.setState({password: e.target.value})}/>*/}
                                {/*        </p>*/}
                                {/*        <p>*/}
                                {/*            <button type="submit">Login</button>*/}
                                {/*        </p>*/}

                                {/*        <p>*/}
                                {/*            Don't have an account? <Link to="/register">Register</Link>*/}
                                {/*        </p>*/}
                                {/*    </fieldset>*/}
                                {/*</form>*/}

                                <Card.Title>
                                    <h2>Sign into ACE</h2>
                                </Card.Title>
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            name="username"
                                            type="text"
                                            placeholder="Enter username"
                                            onChange={this.handleChange}
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
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                Don't have an account? <Link to="/register">Register</Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;