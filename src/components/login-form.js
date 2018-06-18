import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
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

    render (){
        return (
            <div>
                <TextField
                    id="username"
                    label="Usuário"
                    onChange = {(event,newValue) => this.setState({username:newValue})}
                    fullWidth
                />
                <br/>
                <TextField
                    id="password"
                    type="password"
                    label="Senha"
                    onChange = {(event,newValue) => this.setState({password:newValue})}
                    fullWidth
                />
                <br/>
                <Button variant="contained" color="primary" onClick={(event) => this.handleClick(event)}>
                    Entrar
                </Button>
            </div>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(LoginForm);