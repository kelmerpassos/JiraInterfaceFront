import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchIssue, fetchAttachment} from "../actions";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1,
        [theme.breakpoints.up('lg')]: {
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
});

class Issue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            issue : props.issueObj
        };
    }

    componentDidMount(){

        let key = this.props.match ? this.props.match.params.key : null;
        key = this.props.issueObj ? this.props.issueObj.key : key;

        if(key){
            this.props.fetchIssue(key).then(response => {
                this.setState({ issue: this.props.issue });
            });
        }
    }
    
    render (){
        const { classes, theme } = this.props;
        const { issue } = this.state;

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
                                        <strong className={classes.fieldLabel}>Prioridade:</strong>
                                        {issue && issue.priority ? issue.priority : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Tipo:</strong>
                                        {issue && issue.issuetype ? issue.issuetype : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Pontos:</strong>
                                        {issue && issue.storyPoints ? issue.storyPoints : '' }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} container spacing={8}>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Relator:</strong>
                                        {issue && issue.creator ? issue.creator : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Status:</strong>
                                        {issue && issue.status ? issue.status : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Product Owner:</strong>
                                        {issue && issue.productOwner ? issue.productOwner : '' }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={12} container spacing={8}>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Grupo:</strong>
                                        {issue && issue.groupComponents ? issue.groupComponents : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>Versão de Liberação:</strong>
                                        {issue && issue.groupFixVersions ? issue.groupFixVersions : '' }
                                    </Grid>
                                </Grid>
                                <Grid item md={4} sm={6} justify={"flex-start"} container>
                                    <Grid>
                                        <strong className={classes.fieldLabel}>SAC:</strong>
                                        {issue && issue.sac ? issue.sac : '' }
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
                                <Grid container spacing={16}>
                                    <Grid item md={8}>
                                        <Grid container spacing={16}>
                                            <Grid item sm={12}>
                                                <strong className={classes.fieldLabel}>Descrição:</strong>
                                                <span dangerouslySetInnerHTML={{__html: issue && issue.description ? issue.description : '' }}/>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <strong className={classes.fieldLabel}>Solução/Teste:</strong>
                                                <span dangerouslySetInnerHTML={{__html: issue && issue.solution_test ? issue.solution_test : '' }}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <strong className={classes.fieldLabel}>Anexos:</strong>
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
};

function mapStateToProps({issue}) {

    return {issue};
}

export default connect(mapStateToProps, {fetchIssue, fetchAttachment}) (withStyles(styles, { withTheme: true })(Issue));
