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
import {fetchProjectComponents, fetchPriorities} from "../actions";


const styles = theme => ({
    root: {
         display: 'flex',
         flexWrap: 'wrap',
         marginTop: '15px',

    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },
    textKey: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 80,
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
            priorities: [],
            selectedPriorities: [],
            search: '',
            key: '',
        };

        this.filter = '';
    }

    handleFilterChange = event => {
        let priority = '',
            group = '',
            search = '',
            key = '',
            filter = '';

        if(this.state.selectedPriorities.length > 0){
            priority = this.state.selectedPriorities.map(priority => `"${priority}"`).toString();
        }

        priority = priority !== '' ? `priority in (${priority})` : '';

        if(this.state.selectedGroups.length > 0){
            group = this.state.selectedGroups.map(group => `"${group}"`).toString();
        }

        group = group !== '' ? `component in (${group})` : '';

        if(this.state.search.length > 2){
            search = `text ~ "${this.state.search}" or SAC ~ "${this.state.search}"`;
        }

        if(this.state.key.length >= 6){
            key = `key = "${this.state.key}"`;
        }

        filter = priority;
        if(group !== ''){
            filter = filter !== '' ? `${filter} and ${group}` : group;
        }

        if(search !== ''){
            filter = filter !== '' ? `${filter} and ${search}` : search;
        }

        if(key !== ''){
            filter = filter !== '' ? `${filter} and ${key}` : key;
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

    handlePriorityChange = event => {
        this.setState({
            selectedPriorities: event.target.value,
        });
    };

    handleSearchChange = event => {
        this.setState({
            search: event.target.value,
        });
    };

    handleKeyChange = event => {
        this.setState({
            key: event.target.value,
        });
    };

    componentDidMount(){

        if(!this.props.groups){
            this.props.fetchProjectComponents().then(response => {
                this.setState({ groups: this.props.groups });
            });
        }

        if(!this.props.priorities){
            this.props.fetchPriorities().then(response => {
                this.setState({ priorities: this.props.priorities });
            });
        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <FormControl className={classes.formControl}>
                        <Grid item>
                            <InputLabel htmlFor="select-priorities">Prioridade</InputLabel>
                            <Select
                                multiple
                                className={classes.select}
                                value={this.state.selectedPriorities}
                                onChange={this.handlePriorityChange}
                                input={<Input id="select-priorities" />}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {this.state.priorities.map(priority => (
                                    <MenuItem key={priority.id} value={priority.name}>
                                        <Checkbox checked={this.state.selectedPriorities.indexOf(priority.name) > -1} />
                                        <ListItemText primary={priority.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Grid item>
                            <InputLabel htmlFor="select-group">Grupo</InputLabel>
                            <Select
                                multiple
                                className={classes.select}
                                value={this.state.selectedGroups}
                                onChange={this.handleGroupChange}
                                input={<Input id="select-group" />}
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
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Grid item>
                            <TextField
                                id="input-search"
                                label="Pesquisa"
                                className={classes.textField}
                                value={this.state.search}
                                onChange={this.handleSearchChange}
                            />
                        </Grid>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Grid item>
                            <TextField
                                id="input-key"
                                label="Chave"
                                className={classes.textKey}
                                value={this.state.key}
                                onChange={this.handleKeyChange}
                            />
                        </Grid>
                    </FormControl>
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

    return { groups: state.components,
             priorities: state.priorities};
}

export default connect(mapStateToProps, { fetchProjectComponents, fetchPriorities }) (withStyles(styles, { withTheme: true })(FilterIssues));
