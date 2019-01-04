import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListIssues  from './list-issues';
import Issue from "./issue";
import { sessionLogin } from "../actions";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        //width: "100%"
    },
});

class Home extends Component {

    constructor(props){
        super(props);
        let login_session = localStorage.getItem('login_session');

        if(login_session){
            login_session = JSON.parse(login_session);
        }

        this.state = {
            login_session: login_session? login_session : props.login_session
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let login_session = localStorage.getItem('login_session');

        if(!login_session){
            history.push('/login');
        }
    }

    render (){
        const { classes, theme, history } = this.props;

        if (!this.state.login_session || !this.state.login_session.authenticated){
            history.push('/login');
            return (<div/>);
        }else{
            return (
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton color="inherit" aria-label="Menu">
                                <MenuIcon />
                            </IconButton>
                            {/*<Typography variant="title" color="inherit">*/}
                            {/*Title*/}
                            {/*</Typography>*/}
                        </Toolbar>
                    </AppBar>
                    <ListIssues
                        fetchIssues="backlog"
                        title="Documentos"
                    />
                    <Switch>
                        <Route path="/issues/:id" component={Issue}/>
                    </Switch>
                </div>
            );
        }
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

function mapStateToProps({login_session}) {
    return {
        login_session,
    };
}

export default connect(mapStateToProps, {sessionLogin}) (withStyles(styles, { withTheme: true })(Home));
