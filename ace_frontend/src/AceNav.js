import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';

class AceNav extends React.Component {

    render() {

        let logLink;
        if (this.props.username) {
            logLink = <Link to="/me" style={{color: 'white'}}>{this.props.username}</Link>
        } else {
            logLink = <Link to="/login" style={{ color: 'white' }}>Login</Link>
        }

        return (
            <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" style={{zIndex: '1000'}}>
                <Navbar.Brand href="/">ACE Courses</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="/">Home</Nav.Link> */}
                        <Link to="/search/departments" style={{ color: 'white' }}>Departments</Link>
                    </Nav>
                    <Nav>
                        {logLink}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default AceNav;