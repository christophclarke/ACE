import React from 'react';
import Jumbotron from "react-bootstrap/Jumbotron";


const Home = () => (
        <Jumbotron style={{height: 'calc(100vh - 55px)', margin: '0'}}>
            <h1>Welcome to ACE</h1>
            <p>
                The easier way to schedule LSU classes!
            </p>
            <p>
                <a href={"/search/departments"} className={'btn btn-primary'}>Let's Go!</a>
            </p>
        </Jumbotron>
);

export default Home;