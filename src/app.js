import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Home from './components/home';
import LoginForm from './components/login-form';

class App extends Component {
    render () {
        return(
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/login" component={LoginForm}/>
                        <Route path="/" component={Home}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

