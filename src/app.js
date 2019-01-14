import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Home from './components/home';
import LoginForm from './components/login-form';
import Issue from './components/issue';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from "@material-ui/core/Menu";
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { sessionLogin, sessionLogout } from "./actions";
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,

    },
    grow: {
        flexGrow: 1,
    },
    userInfo:{
        display: 'inline-block',
    },
    list: {
        width: 250,
    }
});

class App extends Component {

    constructor(props){
        super(props);

        let login_session = localStorage.getItem('login_session');

        if(login_session){
            login_session = JSON.parse(login_session);
        }

        this.state = {
            title: '',
            isAppBarVisible: true,
            login_session: login_session? login_session : props.login_session,
            historyObj: null,
            anchorElUser: null,
            sideListOpen: false,
        };
    }

    updateAppBar = (historyObj, title, isAppBarVisible = true, login_session = null) =>{
        let newState = {
            title,
            isAppBarVisible,
            historyObj
        };

        if(login_session){
            newState.login_session = login_session;
        }

        this.setState(newState);
    };

    toggleDrawer = (open) => () => {
        this.setState({
            sideListOpen: open,
        });
    };

    handleListClickIssues = () => {
        this.state.historyObj.push('/');
    };

    handleUserClick = event => {
        this.setState({ anchorElUser: event.currentTarget });
    };

    handleUserClose = (action) => {
        this.setState({ anchorElUser: null });

        if(action === 'exit'){
            localStorage.removeItem('login_session');
            this.props.sessionLogout(this.state.login_session.token);
        }
    };

    render () {
        const { classes } = this.props;
        const { login_session, anchorElUser } = this.state;
        const openUser = Boolean(anchorElUser);

        const sideList = (
            <div className={classes.list}>
                <List component="nav">
                    <ListItem button onClick={this.handleListClickIssues}>
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lista de Atividades"  />
                    </ListItem>
                </List>
            </div>
        );

        return(
            <div className={classes.root}>
                <Router>
                    <div>
                        { this.state.isAppBarVisible &&
                            (<AppBar position="static">
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        onClick={this.toggleDrawer(true)}
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Drawer open={this.state.sideListOpen} onClose={this.toggleDrawer(false)}>
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            onClick={this.toggleDrawer(false)}
                                            onKeyDown={this.toggleDrawer(false)}
                                        >
                                            {sideList}
                                        </div>
                                    </Drawer>
                                    <Typography variant="subheading" color="inherit" className={classes.grow}>
                                        {this.state.title}
                                    </Typography>
                                    {login_session && login_session.authenticated && (
                                        <div>
                                            <Typography variant="body1" color="inherit" className={classes.userInfo}>
                                                {this.state.login_session.userName}
                                            </Typography>
                                            <IconButton
                                                aria-owns={openUser ? 'user-appbar' : undefined}
                                                aria-haspopup="true"
                                                onClick={this.handleUserClick}
                                                color="inherit"
                                            >
                                                <AccountCircle />
                                            </IconButton>
                                            <Menu
                                                id="user-appbar"
                                                anchorEl={anchorElUser}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={openUser}
                                                onClose={this.handleUserClose}
                                            >
                                                <MenuItem onClick={() => this.handleUserClose('exit')}>Sair</MenuItem>
                                            </Menu>
                                        </div>
                                    )}
                                </Toolbar>
                             </AppBar>)
                        }
                        <Switch>
                            <Route path="/login"
                                   render={(props) => <LoginForm {...props} updateAppBar={this.updateAppBar}/>}
                            />
                            <Route path="/issue/:key"
                                   render={(props) => <Issue {...props} updateAppBar={this.updateAppBar}/>}
                            />
                            <Route path="/"
                                   render={(props) => <Home {...props} updateAppBar={this.updateAppBar}/>}
                            />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({login_session}) {
    return {
        login_session,
    };
}

export default connect(mapStateToProps, {sessionLogin, sessionLogout}) (withStyles(styles, { withTheme: true })(App));
