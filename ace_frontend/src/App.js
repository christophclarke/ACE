import React, { Component } from 'react';
import Home from './Home'
import DepartmentList from './DepartmentList'
import DepartmentDescription from './DepartmentDescription'
import AceNav from './AceNav'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: "/api/"
        }
    }
    render() {
        return (
            <div>
                <AceNav />
                <Switch>
                    {/* The route to the home page */}
                    <Route exact path="/" component={Home} />
                    
                    {/* The route to the department search */}
                    <Route exact path="/departments" render={() =>
                        <DepartmentList url={this.state.url}/>
                    } />
                    
                    {/* The route to a specific course section */}
                    <Route path="/:department/:course/:section" render={(props) => 
                        <p>{props.match.params.course + " Section " + props.match.params.section}</p>
                    } />
                    
                    <Route path="/:department/:course" render={(props) => <p>{props.match.params.course}</p>} />
                    
                    <Route path="/:department" component={DepartmentDescription} />
                </Switch>
            </div>
        )
    }
}

export default App;