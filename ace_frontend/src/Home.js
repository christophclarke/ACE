import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";


const Home = () => (
    <div>
        <Jumbotron>
            <h1>Welcome to ACE</h1>
            <p>
                This is a simple hero unit, a simple jumbotron-style component for calling
                extra attention to featured content or information.
            </p>
            <p>
                <Button variant="primary">Learn more</Button>
            </p>
        <Link to="/departments">Go To The Department Search</Link>
        </Jumbotron>;
    </div>
);

export default Home;