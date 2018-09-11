import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Home from './components/home';
import LoginForm from './components/login-form';
import Issue from './components/issue';

class App extends Component {
    render () {
        return(
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/login" component={LoginForm}/>
                        <Route path="/issue/:key" component={Issue}/>
                        <Route path="/" component={Home}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

