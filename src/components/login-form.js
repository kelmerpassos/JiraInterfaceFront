import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { sessionLogin } from "../actions";
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
        }
    }

    handleClick = (event) => {
        if(this.state.username && this.state.password){
            this.props.sessionLogin(this.state.username, this.state.password).then(response => {
                localStorage.setItem('login_session', JSON.stringify(this.props.login_session));
                this.props.history.push('/');
            }).catch(error =>{
                localStorage.removeItem('login_session');
                alert(error.response.data.message);
            });
        }
    };

    render (){
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item md={3}/>
                    <Grid container item md={6} justify={"center"}>
                        <Grid>
                            <TextField
                                placeholder={'Usuário Broker'}
                                id="username"
                                label="Usuário"
                                onChange = {(event) => this.setState({username : event.target.value})}
                            />
                            <br/>
                            <TextField
                                placeholder={'Senha Broker'}
                                id="password"
                                type="password"
                                label="Senha"
                                onChange = {(event) => this.setState({password : event.target.value})}
                            />
                            <br/>
                            <Button variant="contained" color="primary"
                                    onClick={this.handleClick}
                            >
                                Entrar
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item md={3}/>
                </Grid>
            </div>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

function mapStateToProps({login_session}) {
    return {
        login_session,
    };
}

export default connect( mapStateToProps, {sessionLogin}) (withStyles(styles, { withTheme: true })(LoginForm));