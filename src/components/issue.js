import React, { Component } from 'react';
import PropTypes from "prop-types";
import {withStyles, MuiThemeProvider, createMuiTheme} from "@material-ui/core";
import {connect} from "react-redux";
import {fetchIssue, fetchAttachment, fetchPriorities, updateIssue} from "../actions";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import SelectComp from './SelectComp';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

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
    },
    fieldLabel: {
        color: '#5e6c84'
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
    buttonIcon:{
        marginTop: '-5px'
    }
});

class Issue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            originalIssue: props.issueObj ? JSON.parse(JSON.stringify(props.issueObj)) : null,
            issue : props.issueObj,
            priorities: props.priorities,
            hasChange: false,
            saving: false,
        };
    }

    componentDidMount(){

        let key = this.props.match ? this.props.match.params.key : null;

        key = this.props.issueObj ? this.props.issueObj.key : key;

        if(!this.props.priorities){
            this.props.fetchPriorities().then(response => {
                this.setState({ priorities: this.props.priorities });
            });
        }

        if(key){
            this.props.fetchIssue(key).then(response => {
                this.setState({
                    issue: this.props.issue,
                    originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                });
            });
        }
    }
    
    render (){
        const { classes, theme } = this.props;
        const { issue, originalIssue, hasChange, saving } = this.state;

        function renderAnexos(callFunc, issue) {
            return !issue ? '' : issue.attachment.map( attach => {
                return(
                    <Grid item sm={12} key={attach.content}>
                        <a href={'#'} onClick={(event) => {
                            event.preventDefault();
                            callFunc(issue.key, attach.content).then(response => {
                                window.open(response.payload.data.uri, '_blank');
                            }
                            );
                        }}>{attach.filename}</a>
                    </Grid>
                );}
            );
        }

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item sm={12}>
                        <Typography variant="subheading">
                            <strong className={classes.fieldLabel}>{issue? issue.key : ''}</strong> {issue? ' - ' + issue.summary : ''}
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
                                        { issue && issue.priority && (
                                            <SelectComp
                                                value={issue.priority}
                                                listValues={this.state.priorities}
                                                updateValue={(value) => {
                                                    const changed = originalIssue.priority.id !== value.id;

                                                    issue.priority.id = value.id;
                                                    issue.priority.name = value.name;

                                                    this.setState({
                                                        issue: issue,
                                                        hasChange: changed
                                                    });
                                                } }/>)
                                        }
                                    </Grid>
                                    <Grid>
                                        {
                                            hasChange && !saving && (
                                                <MuiThemeProvider theme={themeButton}>
                                                    <Button className={classes.buttonIcon}
                                                            color="primary"
                                                            size="small"
                                                            onClick={ event => {

                                                                this.setState({
                                                                    saving: true,
                                                                });

                                                                this.props.updateIssue(this.state.issue.key, this.state.issue).then( response => {
                                                                    this.setState({
                                                                        hasChange: false,
                                                                        saving: false,
                                                                        originalIssue: JSON.parse(JSON.stringify(this.props.issue)),
                                                                    });

                                                                    if(this.props.onIssueChange){
                                                                        this.props.onIssueChange(this.state.issue);
                                                                    }
                                                                }).catch( error => {
                                                                    this.setState({
                                                                        saving: false,
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
                                                                    hasChange: false
                                                                });
                                                            }}>
                                                        <CloseIcon/>
                                                    </Button>
                                                </MuiThemeProvider>
                                            )
                                        }
                                        {
                                            saving && (
                                                <CircularProgress style={{marginLeft: '10px'}} size={24} />
                                            )
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Tipo:</span>
                                        {issue && issue.issuetype ? ' ' + issue.issuetype : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Pontos:</span>
                                        {issue && issue.storyPoints ? ' ' + issue.storyPoints : '' }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} container spacing={8}>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Relator:</span>
                                        {issue && issue.creator ? ' ' + issue.creator : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Status:</span>
                                        {issue && issue.status ? ' ' + issue.status : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Product Owner:</span>
                                        {issue && issue.productOwner ? ' ' + issue.productOwner : '' }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} container spacing={8}>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Grupo:</span>
                                        {issue && issue.groupComponents ? ' ' + issue.groupComponents : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>Versão de Liberação:</span>
                                        {issue && issue.groupFixVersions ? ' ' + issue.groupFixVersions : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <span className={classes.fieldLabel}>SAC:</span>
                                        {issue && issue.sac ? ' ' + issue.sac : '' }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Grid>
                    { !this.props.issue  && (
                        <Grid item sm={12} justify={"center"} container>
                            <Grid>
                                <CircularProgress className={classes.progress} size={50} />
                            </Grid>
                        </Grid>)
                    }
                    { this.props.issue && (
                        <Grid item sm={12}>
                            <Typography variant="body2">
                                <Grid container spacing={8}>
                                    <Grid item md={8}>
                                        <Grid container spacing={8}>
                                            <Grid item sm={12}>
                                                <span className={classes.fieldLabel}>Solução/Teste:</span>
                                                <span dangerouslySetInnerHTML={{__html: issue && issue.solution_test ? issue.solution_test : '' }}/>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <span className={classes.fieldLabel}>Descrição:</span>
                                                <span dangerouslySetInnerHTML={{__html: issue && issue.description ? issue.description : '' }}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4}>
                                        <span className={classes.fieldLabel}>Anexos:</span>
                                        <Grid container spacing={8}>
                                            {
                                                renderAnexos(this.props.fetchAttachment, issue)
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Typography>
                        </Grid>)
                    }
                </Grid>
            </div>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
    issueObj: PropTypes.object,
    onIssueChange: PropTypes.func,
};

function mapStateToProps({issue, priorities}) {
    return {issue, priorities};
}

export default connect(mapStateToProps, {fetchIssue, fetchAttachment, fetchPriorities, updateIssue}) (withStyles(styles, { withTheme: true })(Issue));
