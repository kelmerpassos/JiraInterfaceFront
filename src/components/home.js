import React, { Component } from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListIssues  from './list-issues';
import { sessionLogin } from "../actions";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
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
            login_session: props.login_session ? props.login_session : login_session
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let login_session = localStorage.getItem('login_session');

        if(!login_session){
            this.props.history.push('/login');
        }
    }

    componentWillMount() {
        let login_session = localStorage.getItem('login_session');

        if(!login_session){
            this.props.history.push('/login');
        }
    }

    componentDidMount() {
        this.props.updateAppBar(this.props.history, 'Lista de Atividades');
    }

    render (){
        const { classes, history } = this.props;

        if (!this.state.login_session || !this.state.login_session.authenticated){
            history.push('/login');
            return (<div/>);
        }else{
            return (
                <div className={classes.root}>
                    <ListIssues
                        fetchIssues="backlog"
                        title="Atividades"
                        notAuthCall={(error) => {
                            this.props.history.push('/login');
                        }}
                    />
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
