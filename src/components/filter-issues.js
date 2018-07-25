import React, { Component } from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {fetchProjectComponents} from "../actions";


const styles = theme => ({
    root: {
        // display: 'flex',
        // flexWrap: 'wrap',
        flexGrow: 1,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    input: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
    select: {
        width: 300,
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class FilterIssues extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            selectedGroups: [],
            resumo: ''
        };

        this.filter = '';
    }

    handleFilterChange = event => {
        let filter = '',
            resumo = '';

        if(this.state.selectedGroups.length > 0){
            filter = this.state.selectedGroups.toString();
        }

        filter = filter !== '' ? `component in (${filter})` : '';

        if(this.state.resumo.length > 2){
            resumo = `text ~ "${this.state.resumo}"`;
            filter = filter !== '' ? `${filter} and ${resumo}` : resumo;
        }

        if(this.filter !== filter){
            this.filter = filter;
            this.props.onChangeFilter(this.filter);
        }
    };

    handleGroupChange = event => {
        this.setState({
            selectedGroups: event.target.value,
        });
    };

    handleResumoChange = event => {
        this.setState({
            resumo: event.target.value,
        });
    };

    componentDidMount(){

        if(!this.props.groups){
            this.props.fetchProjectComponents().then(response => {
                this.setState({ groups: this.props.groups });
            });
        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl}>
                    <Grid container spacing={16}>
                        <Grid item md={5}>
                            <InputLabel htmlFor="select-multiple-checkbox">Grupo</InputLabel>
                            <Select
                                multiple
                                className={classes.select}
                                value={this.state.selectedGroups}
                                onChange={this.handleGroupChange}
                                input={<Input id="select-multiple-checkbox" />}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {this.state.groups.map(group => (
                                    <MenuItem key={group.id} value={group.name}>
                                        <Checkbox checked={this.state.selectedGroups.indexOf(group.name) > -1} />
                                        <ListItemText primary={group.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item md={5}>
                            <TextField
                                id="input-resumo"
                                label="Resumo"
                                className={classes.textField}
                                value={this.state.resumo}
                                onChange={this.handleResumoChange}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <IconButton
                                color="primary"
                                className={classes.button}
                                aria-label="Pesquisa de tickets"
                                onClick={this.handleFilterChange}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </FormControl>
            </div>
        );
    }
}

FilterIssues.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
};

function mapStateToProps(state) {

    return { groups: state.components };
}

export default connect(mapStateToProps, { fetchProjectComponents }) (withStyles(styles, { withTheme: true })(FilterIssues));
