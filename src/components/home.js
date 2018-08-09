import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

import ListIssues  from './list-issues';
import Issue from "./issue";

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        //width: "100%"
    },
});

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: 0,
            token: '',
            authenticated: true,
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    render (){
        const { classes, theme, history } = this.props;

        if (!this.state.authenticated){
            history.push('/login');
        }

        return (
            <div className={classes.root}>
                {/*<AppBar position="static">*/}
                    {/*<Toolbar>*/}
                        {/*<IconButton color="inherit" aria-label="Menu">*/}
                            {/*<MenuIcon />*/}
                        {/*</IconButton>*/}
                        {/*/!*<Typography variant="title" color="inherit">*!/*/}
                        {/*/!*Title*!/*/}
                        {/*/!*</Typography>*!/*/}
                    {/*</Toolbar>*/}
                {/*</AppBar>*/}
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                        centered>

                        <Tab label="Sprint" />
                        <Tab label="Backlog" />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}>

                    <TabContainer dir={theme.direction}>
                        <ListIssues
                            fetchIssues="sprint"
                            title="Atividades na Sprint"
                        />
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <ListIssues
                            fetchIssues="backlog"
                            title="Atividades no Backlog"
                        />
                    </TabContainer>
                </SwipeableViews>

                <Switch>
                    <Route path="/issues/:id" component={Issue}/>
                </Switch>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })( Home);
