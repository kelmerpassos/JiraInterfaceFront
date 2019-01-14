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
import HighlightOff from '@material-ui/icons/HighlightOff';
import { fetchPriorityList, fetchSprintList, fetchStatusList, fetchIssueEditMeta } from "../actions";

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
        width: 250,
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};

class FilterIssues extends Component {

    constructor(props) {
        super(props);

        this.state = {
            departments:[],
            selectedDepartments: [],
            priority_list: props.priority_list,
            selectedPriorities: [],
            status_list: props.status_list,
            selectedStatus: [],
            sprint_list: props.sprint_list,
            selectedSprints: [],
            selectedSprintsID: [],
            search: '',
            key: '',
        };

        this.filter = '';
    }

    handleFilterChange = event => {
        let priority = '',
            status = '',
            sprint = '',
            noSprint = '',
            department = '',
            search = '',
            key = '',
            filter = '',
            backlogId,
            sprintIdList = this.state.selectedSprintsID.slice(0, this.state.selectedSprintsID.length +1);

        if(this.state.selectedPriorities.length > 0){
            priority = `priority in (${this.state.selectedPriorities.map(item => `"${item}"`).toString()})`;
        }

        if(this.state.selectedStatus.length > 0){
            status = `status in (${this.state.selectedStatus.map(item => `"${item}"`).toString()})`;
        }

        backlogId = sprintIdList.indexOf(-1);

        if(backlogId > -1){
            let noSprintItem = [],
                item;

            for(let i = 0; i < this.state.sprint_list.length; i++){
                item = this.state.sprint_list[i];
                if(sprintIdList.indexOf(item.id) === -1){
                    noSprintItem.push(item.id);
                }
            }

            noSprint = `Sprint is EMPTY`;

            sprintIdList.splice(backlogId,1);
        }

        if(sprintIdList.length > 0){
            sprint = `Sprint in (${sprintIdList.toString()})`;
        }

        if(noSprint !== ''){
            if (sprint !== ''){
                noSprint = `or ${noSprint}`;
            }

            sprint = `(${sprint} ${noSprint})`;
        }

        if(this.state.selectedDepartments.length > 0){
            department = `Departamento in (${this.state.selectedDepartments.map(item => `"${item}"`).toString()})`;
        }

        if(this.state.search.length > 2){
            search = `text ~ "${this.state.search}" or SAC ~ "${this.state.search}"`;
        }

        if(this.state.key !== ''){
            key = `key = "${this.state.key}"`;
        }

        if(key !== '' && !/^(serv-)[0-9]+$/i.test(this.state.key)){
            key = '';
            alert('Chave da Atividade inválida. A chave é composta da palavra SERV- seguida por um número.');
            return '';
        }

        function addFilter(value){

            if(value !== ''){
                filter = filter !== '' ? `${filter} and ${value}` : value;
            }
        }

        addFilter(priority);
        addFilter(status);
        addFilter(sprint);
        addFilter(department);
        addFilter(search);
        addFilter(key);

        if(filter !== ''){
            this.filter = filter;
            this.props.onChangeFilter(this.filter);
        } else{
            alert('Pelo menos um filtro deve ser informado.');
        }
    };

    handleDepartmentChange = event => {
        this.setState({
            selectedDepartments: event.target.value,
        });
    };

    handlePriorityChange = event => {
        this.setState({
            selectedPriorities: event.target.value,
        });
    };

    handleStatusChange = event => {
        this.setState({
            selectedStatus: event.target.value,
        });
    };

    handleSprintChange = event => {
        this.setState({
            selectedSprintsID: event.target.value.map( name => {
                let selected = this.state.sprint_list.find( (sprint, index, array) => {
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

    handleClearFilterClick = event => {
        this.setState({
            selectedDepartments: [],
            selectedPriorities: [],
            selectedStatus: [],
            selectedSprints: [],
            selectedSprintsID: [],
            search: '',
            key: '',
        });
    };

    componentDidMount(){

        if(!this.props.departments){
            this.props.fetchIssueEditMeta().then(response => {
                this.setState({ departments: this.props.departments });
            }).catch(error => {
                if (error.response.status === 401) {
                    this.props.notAuthCall(error);
                }
            });
        }

        if(!this.props.priority_list){
            this.props.fetchPriorityList().then(response => {
                this.setState({ priority_list: this.props.priority_list });
            }).catch(error => {
                if (error.response.status === 401) {
                    this.props.notAuthCall(error);
                }
            });
        }

        if(!this.props.status_list){
            this.props.fetchStatusList().then(response => {
                this.setState({ status_list: this.props.status_list });
            }).catch(error => {
                if (error.response.status === 401) {
                    this.props.notAuthCall(error);
                }
            });
        }

        if(!this.props.sprint_list){
            this.props.fetchSprintList().then(response => {
                let sprints = this.props.sprint_list;
                sprints.push({
                   id: -1,
                   name: 'Backlog',
                   state: 'Aberto'
                });
                this.setState({ sprint_list: sprints });
            }).catch(error => {
                if (error.response.status === 401) {
                    this.props.notAuthCall(error);
                }
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
                    <Grid item md={11} container>
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
                                    {this.state.sprint_list && this.state.sprint_list.map(sprint => (
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
                                <InputLabel htmlFor="select-department">Departamento</InputLabel>
                                <Select
                                    multiple
                                    className={classes.select}
                                    value={this.state.selectedDepartments}
                                    onChange={this.handleDepartmentChange}
                                    input={<Input id="select-department" />}
                                    renderValue={selected => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    { this.state.departments && this.state.departments.map(department => (
                                        <MenuItem key={department.id} value={department.value}>
                                            <Checkbox checked={this.state.selectedDepartments.indexOf(department.value) > -1} />
                                            <ListItemText primary={department.value} />
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
                                    {this.state.priority_list && this.state.priority_list.map(priority => (
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
                                <InputLabel htmlFor="select-status">Situação</InputLabel>
                                <Select
                                    multiple
                                    className={classes.select}
                                    value={this.state.selectedStatus}
                                    onChange={this.handleStatusChange}
                                    input={<Input id="select-status" />}
                                    renderValue={selected => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {this.state.status_list && this.state.status_list.map(status => (
                                        <MenuItem key={status.id} value={status.name}>
                                            <Checkbox checked={this.state.selectedStatus.indexOf(status.name) > -1} />
                                            <ListItemText primary={status.name} />
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
                                    onKeyUp={ event => {
                                        if(event.keyCode === 13){
                                            this.handleFilterChange();
                                        }
                                    }}
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
                                    onKeyUp={ event => {
                                        if(event.keyCode === 13){
                                            this.handleFilterChange();
                                        }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item md={1}>
                        <Grid item>
                            <IconButton
                                color="primary"
                                className={classes.button}
                                aria-label="Pesquisa de tickets"
                                onClick={this.handleFilterChange}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Grid>	
                        <Grid item>
                            <IconButton
                                color="primary"
                                className={classes.button}
                                aria-label="Limpar filtros"
                                onClick={this.handleClearFilterClick}
                            >
                                <HighlightOff />
                            </IconButton>
                        </Grid>
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
    notAuthCall: PropTypes.func.isRequired,
};

function mapStateToProps({issue_editmeta, priority_list, sprint_list, status_list}) {
    return { departments: issue_editmeta.departments,
             priority_list,
             sprint_list,
             status_list,
    };
}

export default connect(mapStateToProps, { fetchPriorityList, fetchSprintList, fetchStatusList,
                       fetchIssueEditMeta}) (withStyles(styles, { withTheme: true })(FilterIssues));
