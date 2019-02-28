import React, { Component } from 'react';
import Home from './Home'
import DepartmentList from './DepartmentList'
import DepartmentFull from './DepartmentFull'
import AceNav from './AceNav'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
// import BasicExample from './BasicExample';


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: "http://ec2-3-17-67-110.us-east-2.compute.amazonaws.com:8000/api"
        }
    }
    render() {
        return (
            <div>
                <AceNav />
                <Switch>
                    <Route exact path="/departments" render={() =>
                        <DepartmentList url={this.state.url}/>
                    } />
                    <Route path="/:department/:course/:section" render={(props) => <p>{props.match.params.course + " Section " + props.match.params.section}</p>} />
                    <Route path="/:department/:course" render={(props) => <p>{props.match.params.course}</p>} />
                    <Route path="/:department" component={DepartmentFull} />
                    <Route path="/" component={Home} />
                </Switch>
            </div>
        )
    }
}

export default App;