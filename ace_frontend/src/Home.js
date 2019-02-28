import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


const Home = () => (
    <div>
        <h1>This Is The Home Component</h1>
        <Link to="/departments">Go To The Department Search</Link>
    </div>
);

export default Home;