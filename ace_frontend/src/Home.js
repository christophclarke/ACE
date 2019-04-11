import React from 'react';
import { Link } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";


const Home = () => (
        <Jumbotron style={{height: 'calc(100vh - 55px)', margin: '0'}}>
            <h1>Welcome to ACE</h1>
            <p>
                The easier way to schedule LSU classes!
            </p>
            <p>
                <a href={"/search/departments"} className={'btn btn-primary'}>Let's Go!</a>
            </p>
        {/*<Link to="/search/departments">Go To The Department Search</Link>*/}
        </Jumbotron>
);

export default Home;