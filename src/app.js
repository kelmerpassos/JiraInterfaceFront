import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Home from './components/home';
import LoginForm from './components/login-form';
import Issue from './components/issue';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        //width: "100%"
    },
});

class App extends Component {
    render () {
        const { classes } = this.props;

        return(
            <div className={classes.root}>
                <BrowserRouter>
                    <div>
                        <Switch>
                            <Route path="/login" component={LoginForm}/>
                            <Route path="/issue/:key" component={Issue}/>
                            <Route path="/" component={Home}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })( App);
