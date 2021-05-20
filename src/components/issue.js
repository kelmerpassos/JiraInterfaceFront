import React, { Component } from 'react';
import PropTypes from "prop-types";
import {withStyles, MuiThemeProvider, createMuiTheme, TextField} from "@material-ui/core";
import {connect} from "react-redux";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { getPropertyName} from '../utils';
import SelectComp from './SelectComp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    fetchIssue,
    fetchAttachment,
    fetchPriorityList,
    updateIssueField,
    fetchSprintList,
    fetchIssueEditMeta,
    sessionLogin,
    fetchProjectComponents
} from "../actions";

const themeButton = createMuiTheme({
    palette: {
        primary: green,
        secondary: red,
    },
});

const styles = theme => ({
    root: {
        flexGrow: 1,
        [theme.breakpoints.up('md')]: {
            width: '1024px',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        [theme.breakpoints.up('lg')]: {
            width: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
    },
    fieldLabel: {
        color: '#5e6c84'
    },
    labelSubTile: {
        color: '#5e6c84',
        marginBottom: '10px',
        textAlign: 'center',
        fontSize: '18px',
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
    buttonIcon:{
        marginTop: '-5px',
    },
    blockAttaches:{
        marginBottom: '8px',
    },
});

class Issue extends Component {
    constructor(props) {
        super(props);

        let login_session = localStorage.getItem('login_session');

        if(login_session){
            login_session = JSON.parse(login_session);
        }

        this.state = {
            originalIssue: props.issueObj ? JSON.parse(JSON.stringify(props.issueObj)) : null,
            issue : props.issueObj,
            homologadorHasChange: false,
            homologadorSaving: false,
            priority_list: props.priority_list,
            priorityHasChange: false,
            prioritySaving: false,
            sprint_list: props.sprint_list,
            sprintHasChange: false,
            sprintSaving: false,
            departments_list: props.departments_list,
            departmentHasChange: false,
            departmentSaving: false,
            components_list: props.components_list,
            componentHasChange: false,
            componentSaving: false,
            productOwners: props.productOwners,
            productOwnerHasChange: false,
            productOwnerSaving: false,
            requireHomologValues: props.requireHomologValues,
            requireHomoHasChange: false,
            requireHomoSaving: false,
            priorityOrderValues: props.priorityOrderValues,
            priorityOrderHasChange: false,
            priorityOrderSaving: false,            
            loading: false,
            login_session: login_session? login_session : props.login_session,
        };
    }

    validateSession = () => {
        let login_session = localStorage.getItem('login_session');

        if(!login_session){
            this.props.history.push('/login');
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.validateSession();
    }

    componentWillMount() {
        this.validateSession();
        localStorage.setItem('prevPath', JSON.stringify(this.props.location));
    }

    componentDidMount(){

        if (this.state.login_session) {
            if (this.props.updateAppBar) {
                this.props.updateAppBar(this.props.history, 'Atividade');
            }

            let key = this.props.match ? this.props.match.params.key : null;
            key = this.props.issueObj ? this.props.issueObj.key : key;

            if (!this.props.priority_list && this.props.fetchPriorityList) {
                this.props.fetchPriorityList().then(response => {
                        this.setState({priority_list: this.props.priority_list}
                    );
                }).catch(error => {
                    if (error.response.status === 401) {
                        this.props.history.push('/login');
                    }
                });
            }

            if (!this.props.sprint_list && this.props.fetchSprintList) {
                this.props.fetchSprintList().then(response => {
                    this.setState({sprint_list: this.props.sprint_list});
                }).catch(error => {
                    if (error.response.status === 401) {
                        this.props.history.push('/login');
                    }
                });
            }

            if (!this.props.components_list && this.props.fetchProjectComponents) {
                this.props.fetchProjectComponents().then(response => {
                    this.setState({components_list: this.props.components_list});
                }).catch(error => {
                    if (error.response.status === 401) {
                        this.props.history.push('/login');
                    }
                });
            }

            if (!this.props.productOwners && this.props.fetchIssueEditMeta) {
                this.props.fetchIssueEditMeta().then(response => {
                    this.setState({
                        departments_list: this.props.departments_list,
                        productOwners: this.props.productOwners,
                        requireHomologValues: this.props.requireHomologValues,
                        priorityOrderValues: _this2.props.priorityOrderValues
                    });
                }).catch(error => {
                    if (error.response.status === 401) {
                        this.props.history.push('/login');
                    }
                });
            }

            if (key) {
                this.setState({loading: true});
                this.props.fetchIssue(key).then(response => {
                    this.setState({
                        issue: this.props.issue,
                        originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                        loading: false,
                    });
                }).catch(error => {
                    this.setState({loading: false});
                    if (error.response.status !== 401) {
                        alert('Não foi possível realizar a busca das informações');
                    } else {
                        this.props.history.push('/login');
                    }
                });
            }
        }
    }

    formartData(data){
        data = data.split("T")[0]
        let fragments = data.split('-')
        return `${fragments[2]}/${fragments[1]}/${fragments[0]}`
    }
    
    render (){
        const { classes, history } = this.props;
        const { issue, originalIssue, homologadorHasChange, homologadorSaving, priorityHasChange, prioritySaving, sprintHasChange, sprintSaving, requireHomoHasChange,
                requireHomoSaving, productOwnerHasChange, productOwnerSaving, departmentHasChange, departmentSaving,
                componentHasChange, componentSaving, priorityOrderSaving, priorityOrderHasChange , login_session} = this.state;
        const columnData = [
                    { id: 'id', numeric: false, disablePadding: false, label: 'Chave' },
                    { id: 'groupDepartments', numeric: false, disablePadding: false, label: 'Departamento' },
                    { id: 'issuetype', numeric: false, disablePadding: false, label: 'Tipo' },
                    { id: 'summary', numeric: false, disablePadding: false, label: 'Resumo' },
                    { id: 'status', numeric: false, disablePadding: false, label: 'Situação' },
                    { id: 'groupFixVersions', numeric: false, disablePadding: false, label: 'Versão de Liberação' },
                    { id: 'storyPoints', numeric: false, disablePadding: false, label: 'Pontos' },
                    { id: 'priorityId', numeric: false, disablePadding: false, label: 'Prioridade' },
                    { id: 'sprint', numeric: false, disablePadding: false, label: 'Sprint' },
                ];
                
        function renderAttachment(callFunc, issue, listAttach) {
            return !issue || !listAttach ? '' : listAttach.map(attach => {
                    return (
                        <Grid item sm={12} key={attach.content}>
                            <a href={'#'} onClick={(event) => {
                                event.preventDefault();
                                callFunc(issue.key, attach.content).then(response => {
                                        window.open(response.payload.data.uri, '_blank');
                                    }
                                );
                            }}>{attach.filename}</a>
                        </Grid>
                    );
                }
            );
        }

        function renderLink(issues){
            return (
                <Grid item container spacing={8} className={classes.blockAttaches}>  
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant={"subheading"}>
                                        Chave
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant={"subheading"}>
                                        Resumo
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant={"subheading"}>
                                        Situação
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {issues.issuelinks.map(link=>{
                                return (
                                    <TableRow key={link.id}>
                                        <TableCell>
                                            {link.outwardIssue ? link.outwardIssue.key : link.inwardIssue.key}
                                        </TableCell>
                                        <TableCell>
                                            {link.outwardIssue ? link.outwardIssue.fields.summary: link.inwardIssue.fields.summary}
                                        </TableCell>
                                        <TableCell>
                                            {link.outwardIssue ? link.outwardIssue.fields.status.name : link.inwardIssue.fields.status.name}
                                        </TableCell>
                                    </TableRow>   
                                )
                            })}
                        </TableBody>
                    </Table>
                </Grid>
            )       
        }

        if (!login_session || !login_session.authenticated){
            history.push('/login');
            return (<div/>);
        }else {
            return (                
                <div className={classes.root}>
                    
                    <Paper className={classes.paper}>
                        <Grid container spacing={16}>
                            <Grid item sm={12}>
                                <Typography variant="subheading">
                                    <strong
                                        className={classes.fieldLabel}>{issue ? issue.key : ''}</strong> {issue ? ' - ' + issue.summary : ''}
                                </Typography>
                            </Grid>
                            <Grid item sm={12}>
                                <Typography variant="body2">
                                    <Grid container item sm={12} spacing={8}>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Prioridade:</span>
                                            </Grid>
                                            <Grid>
                                                {issue && issue.priority && (
                                                    <SelectComp
                                                        value={issue.priority}
                                                        listValues={this.state.priority_list}
                                                        valueProp={'name'}
                                                        updateValue={(value) => {
                                                            const changed = originalIssue.priority.id !== value.id;

                                                            issue.priority.id = value.id;
                                                            issue.priority.name = value.name;

                                                            this.setState({
                                                                issue: issue,
                                                                priorityHasChange: changed
                                                            });

                                                        }}/>)
                                                }
                                            </Grid>
                                            <Grid>
                                                {
                                                    priorityHasChange && !prioritySaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            prioritySaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.priority)).then(response => {
                                                                            this.setState({
                                                                                priorityHasChange: false,
                                                                                prioritySaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                prioritySaving: false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.priority.id = originalIssue.priority.id;
                                                                        issue.priority.name = originalIssue.priority.name;

                                                                        this.setState({
                                                                            issue: issue,
                                                                            priorityHasChange: false
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    prioritySaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Tipo:</span>
                                                {issue && issue.issuetype ? ' ' + issue.issuetype : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Pontos:</span>
                                                {issue && issue.storyPoints ? ' ' + issue.storyPoints : ''}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12} container spacing={8}>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Relator:</span>
                                                {issue && issue.creator ? ' ' + issue.creator : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Situação:</span>
                                                {issue && issue.status ? ' ' + issue.status : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Product Owner:</span>
                                            </Grid>
                                            <Grid>
                                                {issue && issue.productOwner && (
                                                    <SelectComp
                                                        value={issue.productOwner}
                                                        listValues={this.state.productOwners}
                                                        valueProp={'value'}
                                                        updateValue={(value) => {
                                                            const changed = originalIssue.productOwner.id !== value.id;

                                                            issue.productOwner.id = value.id;
                                                            issue.productOwner.value = value.value;

                                                            this.setState({
                                                                issue: issue,
                                                                productOwnerHasChange: changed
                                                            });

                                                        }}
                                                    />)
                                                }
                                            </Grid>
                                            <Grid>
                                                {
                                                    productOwnerHasChange && !productOwnerSaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            productOwnerSaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.productOwner)).then(response => {
                                                                            this.setState({
                                                                                productOwnerHasChange: false,
                                                                                productOwnerSaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                productOwnerSaving: false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.productOwner.id = originalIssue.productOwner.id;
                                                                        issue.productOwner.value = originalIssue.productOwner.value;

                                                                        this.setState({
                                                                            issue: issue,
                                                                            productOwnerHasChange: false
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    productOwnerSaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12} container spacing={8}>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Responsável:</span>
                                                {issue && issue.assignee ? ' ' + issue.assignee : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Versão de Liberação:</span>
                                                {issue && issue.groupFixVersions ? ' ' + issue.groupFixVersions : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>RNC:</span>
                                                {issue && issue.sac ? ' ' + issue.sac : ''}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12} container spacing={8}>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Sprint:</span>
                                                {issue && issue.sprint && !issue.sprint.canEdit ? ' ' + issue.sprint.name : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>GLPI #:</span>
                                                {issue && issue.glpi ? ' ' + issue.glpi : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Estimativa de pontos do SERV:</span>
                                                {issue && issue.estimativa ? ' ' + issue.estimativa : ''}
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Requer Homologação:</span>
                                            </Grid>
                                            <Grid>
                                                {issue && issue.requireHomologation && (
                                                    <SelectComp
                                                        value={issue.requireHomologation}
                                                        listValues={this.state.requireHomologValues}
                                                        valueProp={'value'}
                                                        updateValue={(newValue) => {
                                                            const changed = originalIssue.requireHomologation.id !== newValue.id;

                                                            issue.requireHomologation.id = newValue.id;
                                                            issue.requireHomologation.value = newValue.value;

                                                            this.setState({
                                                                issue: issue,
                                                                requireHomoHasChange: changed
                                                            });
                                                        }}
                                                    />)
                                                }
                                            </Grid>
                                            <Grid>
                                                {
                                                    requireHomoHasChange && !requireHomoSaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            requireHomoSaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.requireHomologation)).then(response => {
                                                                            this.setState({
                                                                                requireHomoHasChange: false,
                                                                                requireHomoSaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                requireHomoSaving: false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.requireHomologation.id = originalIssue.requireHomologation.id;
                                                                        issue.requireHomologation.value = originalIssue.requireHomologation.value;

                                                                        this.setState({
                                                                            issue: issue,
                                                                            requireHomoHasChange: false
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    requireHomoSaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Criado:</span>
                                                {issue && issue.created ? ' ' + this.formartData(issue.created): ''}                                
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12} container spacing={8}>
                                        <Grid item md={6} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Departamento:</span>
                                            </Grid>
                                            <Grid>
                                                {issue && issue.departments && (
                                                    <SelectComp
                                                        multipleSelection
                                                        value={issue.departments}
                                                        listValues={this.state.departments_list}
                                                        valueProp={'value'}
                                                        classesExternal={{
                                                            select: {
                                                                width: 450,
                                                            }
                                                        }}
                                                        updateValue={(value) => {
                                                            let obj = null,
                                                                i,
                                                                changed = value.length !== originalIssue.departments.length;

                                                            if (!changed) {
                                                                for (i = 0; i < originalIssue.departments.length; i++) {
                                                                    obj = value.find((option, index, array) => {
                                                                        return option.id === originalIssue.departments[i].id
                                                                    });

                                                                    if (obj) {
                                                                        obj.selected = true;
                                                                    }
                                                                }

                                                                for (i = 0; i < value.length; i++) {
                                                                    changed = !value[i].selected;
                                                                    if (changed) {
                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                            issue.departments = value;

                                                            issue.groupDepartments = issue.departments.map((department) =>" "+ department.value).toString();

                                                            this.setState({
                                                                issue: issue,
                                                                departmentHasChange: changed
                                                            });

                                                        }}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid>
                                                {
                                                    departmentHasChange && !departmentSaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            departmentSaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.departments)).then(response => {
                                                                            this.setState({
                                                                                departmentHasChange: false,
                                                                                departmentSaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                departmentSaving: false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.departments = JSON.parse(JSON.stringify(originalIssue.departments));

                                                                        this.setState({
                                                                            issue: issue,
                                                                            departmentHasChange: false,
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    departmentSaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item md={6} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Componente:</span>
                                            </Grid>
                                            <Grid>
                                                {issue && issue.components && (
                                                    <SelectComp
                                                        multipleSelection
                                                        value={issue.components}
                                                        listValues={this.state.components_list}
                                                        valueProp={'name'}
                                                        classesExternal={{
                                                            select: {
                                                                width: 450,
                                                            }
                                                        }}
                                                        updateValue={(value) => {
                                                            let obj = null,
                                                                i,
                                                                changed = value.length !== originalIssue.components.length;

                                                            if (!changed) {
                                                                for (i = 0; i < originalIssue.components.length; i++) {
                                                                    obj = value.find((option, index, array) => {
                                                                        return option.id === originalIssue.components[i].id
                                                                    });

                                                                    if (obj) {
                                                                        obj.selected = true;
                                                                    }
                                                                }

                                                                for (i = 0; i < value.length; i++) {
                                                                    changed = !value[i].selected;
                                                                    if (changed) {
                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                            issue.components = value;

                                                            issue.groupComponents = issue.components.map((component) =>" "+ component.name).toString();

                                                            this.setState({
                                                                issue: issue,
                                                                componentHasChange: changed
                                                            });

                                                        }}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid>
                                                {
                                                    componentHasChange && !componentSaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            componentSaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.components)).then(response => {
                                                                            this.setState({
                                                                                componentHasChange: false,
                                                                                componentSaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                componentSaving: false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.components = JSON.parse(JSON.stringify(originalIssue.components));

                                                                        this.setState({
                                                                            issue: issue,
                                                                            componentHasChange: false,
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    componentSaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Ordem de Prioridade:</span>
                                            </Grid>
                                            <Grid>
                                                {issue && issue.priorityOrder && (
                                                    <SelectComp
                                                        value={issue.priorityOrder}
                                                        listValues={this.state.priorityOrderValues}
                                                        valueProp={'value'}
                                                        updateValue={(newValue) => {
                                                            const changed = originalIssue.priorityOrder.id !== newValue.id;

                                                            issue.priorityOrder.id = newValue.id;
                                                            issue.priorityOrder.value = newValue.value;

                                                            this.setState({
                                                                issue: issue,
                                                                priorityOrderHasChange : changed
                                                            });
                                                        }}
                                                    />)
                                                }
                                            </Grid>
                                            <Grid>
                                                {
                                                    priorityOrderHasChange  && !priorityOrderSaving  && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            priorityOrderSaving : true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.priorityOrder)).then(response => {
                                                                            this.setState({
                                                                                priorityOrderHasChange : false,
                                                                                priorityOrderSaving : false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                priorityOrderSaving : false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.priorityOrder.id = originalIssue.priorityOrder.id;
                                                                        issue.priorityOrder.value = originalIssue.priorityOrder.value;

                                                                        this.setState({
                                                                            issue: issue,
                                                                            priorityOrderHasChange : false
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    priorityOrderSaving  && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>
                                        </Grid> 
										<Grid item md={4} sm={6} justify={"flex-start"} container>
                                            <Grid>
                                                <span className={classes.fieldLabel}>Homologador:</span>
                                            </Grid>
                                            <Grid>
                                                <TextField 
                                                    value={issue && issue.homologador ? issue.homologador : ''}
                                                    onChange={(event) =>{
                                                        const changed = originalIssue.homologador !== event.target.value
                                                        issue.homologador = event.target.value

                                                        this.setState({
                                                            issue: issue,
                                                            homologadorHasChange: changed
                                                        })
                                                    }}
                                                />
                                            </Grid>    
                                            <Grid>
                                                {
                                                    homologadorHasChange && !homologadorSaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            homologadorSaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.homologador)).then(response => {
                                                                            this.setState({
                                                                                homologadorHasChange: false,
                                                                                homologadorSaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                homologadorSaving: false,
                                                                            });

                                                                            console.log('Erro ao salvar', error);
                                                                            alert('Não foi possível salvar as alterações.');
                                                                        });
                                                                    }}>
                                                                <DoneIcon/>
                                                            </Button>
                                                            <Button className={classes.buttonIcon}
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={event => {
                                                                        issue.homologador = originalIssue.homologador;
                                                                        
                                                                        this.setState({
                                                                            issue: issue,
                                                                            homologadorHasChange: false
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    homologadorSaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
                                            </Grid>            
                                        </Grid>											
                                    </Grid>
                                </Typography>
                            </Grid>
                            {this.state.loading && (
                                <Grid item sm={12} justify={"center"} container>
                                    <Grid>
                                        <CircularProgress className={classes.progress} size={50}/>
                                    </Grid>
                                </Grid>)
                            }
                            {this.props.issue && (
                                <Grid item sm={12}>
                                    <Typography variant="body2">
                                        <Grid container spacing={8}>
                                            <Grid item md={8}>
                                                <Grid container spacing={8}>
                                                    <Grid item sm={12}>
                                                        <span className={classes.fieldLabel}>Solução:</span>
                                                        <span
                                                            dangerouslySetInnerHTML={{__html: issue && issue.solution ? issue.solution : ''}}/>
                                                    </Grid>
                                                    <Grid item sm={12}>
                                                        <span className={classes.fieldLabel}>Descrição:</span>
                                                        <span
                                                            dangerouslySetInnerHTML={{__html: issue && issue.description ? issue.description : ''}}/>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item md={4}>
                                                <Paper className={classes.paper}>
                                                    <div className={classes.labelSubTile}>
                                                        <span>Anexos</span>
                                                    </div>
                                                    <Grid item container spacing={8} className={classes.blockAttaches}>
                                                        <span className={classes.fieldLabel}>Atividade:</span>
                                                        {
                                                            renderAttachment(this.props.fetchAttachment, issue, issue ? issue.docAttaches : [])
                                                        }
                                                    </Grid>
                                                    <Grid item container spacing={8} className={classes.blockAttaches}>
                                                        <span className={classes.fieldLabel}>Informativo:</span>
                                                        {
                                                            renderAttachment(this.props.fetchAttachment, issue, issue ? issue.infoAttaches : [])
                                                        }
                                                    </Grid>
                                                    <Grid item container spacing={8} className={classes.blockAttaches}>
                                                        <span className={classes.fieldLabel}>Manual:</span>
                                                        {
                                                            renderAttachment(this.props.fetchAttachment, issue, issue ? issue.manualAttaches : [])
                                                        }
                                                    </Grid>
                                                    <Grid item container spacing={8} className={classes.blockAttaches}>
                                                        <span className={classes.fieldLabel}>Outros:</span>
                                                        {
                                                            renderAttachment(this.props.fetchAttachment, issue, issue ? issue.attachment : [])
                                                        }
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                            <Grid item md={12}>
                                                <Paper className={classes.paper}>
                                                    <div className={classes.labelSubTile}>
                                                        <span>Itens Relacionandos</span>
                                                    </div>
                                                    {
                                                        this.props.issue.issuelinks ? renderLink( this.props.issue): <div><span>Nenhum SERV relacionado</span></div>
                                                    }
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>)
                            }
                        </Grid>
                    </Paper>
                </div>
            );
        }
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
    issueObj: PropTypes.object,
    onIssueChange: PropTypes.func,
};

function mapStateToProps({issue, priority_list, sprint_list, issue_editmeta, login_session, components}) {
    return {
        issue,
        priority_list,
        sprint_list,
        issue_editmeta,
        departments_list: issue_editmeta.departments,
        productOwners: issue_editmeta.productOwners,
        requireHomologValues: issue_editmeta.requireHomologValues,
        priorityOrderValues: issue_editmeta.priorityOrderValues,
        login_session,
        components_list: components,
    };
}

export default connect(mapStateToProps, {fetchIssue, fetchAttachment, fetchPriorityList, updateIssueField, fetchIssueEditMeta,
                       fetchSprintList, sessionLogin, fetchProjectComponents}) (withStyles(styles, { withTheme: true })(Issue));
