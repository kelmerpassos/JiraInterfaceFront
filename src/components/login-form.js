import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { sessionLogin } from "../actions";
import {connect} from "react-redux";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    button: {
        marginTop: theme.spacing.unit*2,
    },
    input: {
        width: '100%'
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 3,
        width: '300px',
        height: '200px'
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

    componentDidMount() {
        this.props.updateAppBar(this.props.history,'', false);
    }

    handleClick = (event) => {
        if(this.state.username && this.state.username !== '' && this.state.password && this.state.password !== ''){
            this.props.sessionLogin(this.state.username, this.state.password).then(response => {
                localStorage.setItem('login_session', JSON.stringify(this.props.login_session));
                this.props.updateAppBar(this.props.history,'', false, this.props.login_session);
                
                let prevPath = null;
                try{
                    prevPath = JSON.parse(localStorage.getItem('prevPath'));
                }catch(error){
                    localStorage.removeItem('prevPath');
                }

                prevPath = prevPath && prevPath.pathname.includes('issue/SERV') ? prevPath : '/';

                localStorage.removeItem('prevPath');
                this.props.history.push(prevPath);

            }).catch(error =>{
                localStorage.removeItem('login_session');
                alert(error.response.data ? error.response.data.message : error);
            });
        }
    };

    render (){
        const { classes } = this.props;

        return (
            <div>
                <Grid container spacing={16}>
                    <Grid item md={1}/>
                    <Grid container item md={10} justify={"center"}>
                        <Paper className={classes.paper}>
                            <Grid container justify={"center"} direction={"column"}>
                                <Grid item xs>
                                    <Typography variant="subheading" color={"primary"}>
                                        <strong>Jira Interface</strong>
                                    </Typography>
                                    <TextField
                                        className={classes.input}
                                        helperText='Utilize o Usuário DDBroker'
                                        id="username"
                                        label="Usuário"
                                        onChange = {(event) => this.setState({username : event.target.value})}
                                        onKeyUp={ event => {
                                            if(event.keyCode === 13){
                                                this.handleClick();
                                            }
                                        }}
                                    />
                                    <br/>
                                    <TextField
                                        className={classes.input}
                                        helperText='Utilize a Senha Broker'
                                        id="password"
                                        type="password"
                                        label="Senha"
                                        onChange = {(event) => this.setState({password : event.target.value})}
                                        onKeyUp={ event => {
                                            if(event.keyCode === 13){
                                                this.handleClick();
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs justify={"center"} container>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleClick}
                                    >
                                        Entrar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item md={1}/>
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