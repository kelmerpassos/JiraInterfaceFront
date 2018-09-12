import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchIssue} from "../actions";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    fieldLabel: {
        color: '#5e6c84'
    }
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

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Typography variant="subheading">
                            <strong className={classes.fieldLabel}>{issue? issue.key : ''}</strong> {issue? ' - ' + issue.summary : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            <Grid container alignItems={"center"}>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Prioridade:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.priority ? issue.priority : '' }
                                </Grid>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Tipo:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.issuetype ? issue.issuetype : '' }
                                </Grid>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Pontos:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.storyPoints ? issue.storyPoints : '' }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Relator:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.creator ? issue.creator : '' }
                                </Grid>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Status:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.status ? issue.status : '' }
                                </Grid>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Product Owner:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.productOwner ? issue.productOwner : '' }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Grupo:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.groupComponents ? issue.groupComponents : '' }
                                </Grid>
                                <Grid item md={2}>
                                    <strong className={classes.fieldLabel}>Versão:</strong>
                                </Grid>
                                <Grid item md={2}>
                                    {issue && issue.groupFixVersions ? issue.groupFixVersions : '' }
                                </Grid>
                            </Grid>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            <Grid container spacing={16}>
                                <Grid item md={8}>
                                    <strong className={classes.fieldLabel}>Descrição:</strong> <span dangerouslySetInnerHTML={{__html: issue && issue.description ? issue.description : '' }}/>
                                </Grid>
                                <Grid item>
                                    <strong className={classes.fieldLabel}>Anexos:</strong>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Grid>
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

export default connect(mapStateToProps, {fetchIssue}) (withStyles(styles, { withTheme: true })(Issue));
