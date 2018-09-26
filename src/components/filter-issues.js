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
import {fetchProjectComponents, fetchPriorities, fetchListSprints} from "../actions";


const styles = theme => ({
    root: {
         display: 'flex',
         flexWrap: 'wrap',
         marginTop: '15px',

    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
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
        width: 200,
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
            sprints: [],
            selectedSprints: [],
            selectedSprintsID: [],
            search: '',
            key: '',
        };

        this.filter = '';
    }

    handleFilterChange = event => {
        let priority = '',
            sprint = '',
            group = '',
            search = '',
            key = '',
            filter = '';

        if(this.state.selectedPriorities.length > 0){
            priority = this.state.selectedPriorities.map(priority => `"${priority}"`).toString();
        }

        priority = priority !== '' ? `priority in (${priority})` : '';

        if(this.state.selectedSprintsID.length > 0){
            sprint = this.state.selectedSprintsID.toString();
        }

        sprint = sprint !== '' ? `Sprint in (${sprint})` : '';

        if(this.state.selectedGroups.length > 0){
            group = this.state.selectedGroups.map(group => `"${group}"`).toString();
        }

        group = group !== '' ? `component in (${group})` : '';

        if(this.state.search.length > 2){
            search = `text ~ "${this.state.search}" or SAC ~ "${this.state.search}"`;
        }

        if(this.state.key !== ''){
            key = `key = "${this.state.key}"`;
        }

        if(key !== '' && !/^(serv-)[0-9]+$/i.test(this.state.key)){
            key = '';
            alert('Chave de documento inválida. A chave é componta da palavra SERV- seguida por um número.');
            return '';
        }

        function addFilter(value){

            if(value !== ''){
                filter = filter !== '' ? `${filter} and ${value}` : value;
            }
        }

        addFilter(priority);
        addFilter(sprint);
        addFilter(group);
        addFilter(search);
        addFilter(key);

        if(filter !== ''){
            this.filter = filter;
            this.props.onChangeFilter(this.filter);
        } else{
            alert('Pelo menos um filtro deve ser informado.');
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

    handleSprintChange = event => {
        this.setState({
            selectedSprintsID: event.target.value.map( name => {
                let selected = this.state.sprints.find( (sprint, index, array) => {
                    return sprint.name === name
                });
               return selected ? selected.id : -1;
            } ),
            selectedSprints: event.target.value,
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

        if(!this.props.sprints){
            this.props.fetchListSprints().then(response => {
                this.setState({ sprints: this.props.sprints });
            });
        }
    }

    translateState(state){
        switch (state) {
            case 'closed':
                return 'Fechada';
            case 'active':
                return 'Aberta';
            case 'future':
                return 'Futura';
            default:
                return state;
        }
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-sprint">Sprint</InputLabel>
                            <Select
                                multiple
                                className={classes.select}
                                value={this.state.selectedSprints}
                                onChange={this.handleSprintChange}
                                input={<Input id="select-sprint" />}
                                renderValue={sprints => sprints.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {this.state.sprints.map(sprint => (
                                    <MenuItem key={sprint.id} value={sprint.name}>
                                        <Checkbox checked={this.state.selectedSprints.indexOf(sprint.name) > -1} />
                                        <ListItemText primary={`${sprint.name} - ${this.translateState(sprint.state)}`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
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
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
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
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <TextField
                                id="input-search"
                                label="Pesquisa"
                                className={classes.textField}
                                value={this.state.search}
                                onChange={this.handleSearchChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <TextField
                                id="input-key"
                                label="Chave"
                                className={classes.textKey}
                                value={this.state.key}
                                onChange={this.handleKeyChange}
                            />
                        </FormControl>
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
             priorities: state.priorities,
             sprints: state.sprints,
    };
}

export default connect(mapStateToProps, { fetchProjectComponents, fetchPriorities, fetchListSprints }) (withStyles(styles, { withTheme: true })(FilterIssues));
