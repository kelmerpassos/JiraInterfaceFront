import React, { Component } from 'react';
import PropTypes from "prop-types";
import {withStyles, MuiThemeProvider, createMuiTheme} from "@material-ui/core";
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
import {
    fetchIssue,
    fetchAttachment,
    fetchPriorityList,
    updateIssueField,
    fetchSprintList,
    fetchIssueEditMeta,
    sessionLogin
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
            width: '960px',
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
            priority_list: props.priority_list,
            priorityHasChange: false,
            prioritySaving: false,
            sprint_list: props.sprint_list,
            sprintHasChange: false,
            sprintSaving: false,
            departments_list: props.departments_list,
            departmentHasChange: false,
            departmentSaving: false,
            productOwners: props.productOwners,
            productOwnerHasChange: false,
            productOwnerSaving: false,
            requireHomologValues: props.requireHomologValues,
            requireHomoHasChange: false,
            requireHomoSaving: false,
            loading: false,
            login_session: login_session? login_session : props.login_session,
        };
    }

    componentWillMount() {
        let login_session = localStorage.getItem('login_session');

        if(!login_session){
            this.props.history.push('/login');
        }
    }

    componentWillUnmount() {
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

            if (!this.props.productOwners && this.props.fetchIssueEditMeta) {
                this.props.fetchIssueEditMeta().then(response => {
                    this.setState({
                        departments_list: this.props.departments_list,
                        productOwners: this.props.productOwners,
                        requireHomologValues: this.props.requireHomologValues,
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        let login_session = localStorage.getItem('login_session');

        if(!login_session){
            this.props.history.push('/login');
        }
    }
    
    render (){
        const { classes, history } = this.props;
        const { issue, originalIssue, priorityHasChange, prioritySaving, sprintHasChange, sprintSaving, requireHomoHasChange,
                requireHomoSaving, productOwnerHasChange, productOwnerSaving, departmentHasChange,
                departmentSaving, login_session} = this.state;

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
                                                <span className={classes.fieldLabel}>SAC:</span>
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
                                            <Grid>
                                                {issue && (issue.sprint ? issue.sprint.canEdit : true) && (
                                                    <SelectComp
                                                        value={issue.sprint}
                                                        listValues={this.state.sprint_list ? this.state.sprint_list.futures : []}
                                                        valueProp={'name'}
                                                        updateValue={(newValue) => {
                                                            const changed = originalIssue.sprint.id !== newValue.id;

                                                            issue.sprint.id = newValue.id;
                                                            issue.sprint.name = newValue.name;

                                                            this.setState({
                                                                issue: issue,
                                                                sprintHasChange: changed
                                                            });
                                                        }}
                                                    />)
                                                }
                                            </Grid>
                                            <Grid>
                                                {
                                                    sprintHasChange && !sprintSaving && (
                                                        <MuiThemeProvider theme={themeButton}>
                                                            <Button className={classes.buttonIcon}
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={event => {

                                                                        this.setState({
                                                                            sprintSaving: true,
                                                                        });

                                                                        this.props.updateIssueField(this.state.issue.key, this.state.issue,
                                                                            getPropertyName(() => this.state.issue.sprint)).then(response => {
                                                                            this.setState({
                                                                                sprintHasChange: false,
                                                                                sprintSaving: false,
                                                                                originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                            });

                                                                            if (this.props.onIssueChange) {
                                                                                this.props.onIssueChange(this.state.issue);
                                                                            }
                                                                        }).catch(error => {
                                                                            this.setState({
                                                                                sprintSaving: false,
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
                                                                        issue.sprint.id = originalIssue.sprint.id;
                                                                        issue.sprint.name = originalIssue.sprint.name;

                                                                        this.setState({
                                                                            issue: issue,
                                                                            sprintHasChange: false
                                                                        });
                                                                    }}>
                                                                <CloseIcon/>
                                                            </Button>
                                                        </MuiThemeProvider>
                                                    )
                                                }
                                                {
                                                    sprintSaving && (
                                                        <CircularProgress style={{marginLeft: '10px'}} size={24}/>
                                                    )
                                                }
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
                                                <span className={classes.fieldLabel}></span>
                                            </Grid>
                                            <Grid>

                                            </Grid>
                                            <Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sm={12} container spacing={8}>
                                        <Grid item md={4} sm={6} justify={"flex-start"} container>
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

function mapStateToProps({issue, priority_list, sprint_list, issue_editmeta, login_session}) {
    return {
        issue,
        priority_list,
        sprint_list,
        issue_editmeta,
        departments_list: issue_editmeta.departments,
        productOwners: issue_editmeta.productOwners,
        requireHomologValues: issue_editmeta.requireHomologValues,
        login_session,
    };
}

export default connect(mapStateToProps, {fetchIssue, fetchAttachment, fetchPriorityList, updateIssueField, fetchIssueEditMeta,
                       fetchSprintList, sessionLogin}) (withStyles(styles, { withTheme: true })(Issue));
