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
        maxHeight: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
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
        const { classes, theme, issue } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Typography variant="subheading" gutterBottom>
                            {issue ? (issue.key +' - '+ issue.summary) : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={16}>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Prioridade:</b> {issue && issue.priority ? issue.priority : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Tipo:</b> {issue && issue.issuetype ? issue.issuetype : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Pontos:</b> {issue && issue.storyPoints ? issue.storyPoints : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Relator:</b> {issue && issue.creator ? issue.creator : '' }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={16}>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Status:</b> {issue && issue.status ? issue.status : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Product Owner:</b> {issue && issue.productOwner ? issue.productOwner : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Grupo:</b> {issue && issue.groupComponents ? issue.groupComponents : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Versão:</b> {issue && issue.groupFixVersions ? issue.groupFixVersions : '' }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={16}>
                            <Grid item md={8}>
                                <Typography variant="body2" gutterBottom>
                                    <b>Descrição:</b> {issue && issue.description ? issue.description : '' }
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" gutterBottom>
                                    <b>Anexos:</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
    issue: PropTypes.object,
};

function mapStateToProps({issue}) {

    return {issue};
}

export default connect(mapStateToProps, {fetchIssue}) (withStyles(styles, { withTheme: true })(Issue));
