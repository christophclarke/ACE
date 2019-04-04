import React, {Component} from 'react';
import {Button, Card, Col, Container, Row} from 'react-bootstrap'

class UserInfo extends Component {
    render() {
        return (
            <Card>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col sm={{span: 4}}>
                                <h2>{this.props.username}</h2>
                            </Col>
                            <Col sm={{span: 4, offset: 8}}>
                                <Button onClick={this.props.handleLogout}>Logout</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    }
}

export default UserInfo;