import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {Link} from 'react-router-dom';

const AceNav = () => (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand href="/">ACE Courses</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                {/* <Nav.Link href="/">Home</Nav.Link> */}
                <Link to="/departments" style={{color: 'white'}}>Departments</Link>
            </Nav>
            <Nav>
                <Nav.Link href="#deets">More deets</Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                    Dank memes
        </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
)

export default AceNav;