import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBacklogIssues } from '../actions';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

class BacklogIssues extends Component{
    componentDidMount(){
        this.props.fetchBacklogIssues();
    }

    renderIssues(){
        return _.map(this.props.issues, issue => {
            return(
                <TableRow key={issue.key}>
                    <TableCell component="th" scope="row">
                        {issue.key}
                    </TableCell>
                    <TableCell>{issue.issuetype}</TableCell>
                    <TableCell>{issue.status}</TableCell>
                    <TableCell>{issue.summary}</TableCell>
                </TableRow>
            );
        });
    }

    render (){
        const { classes } = this.props;

        return (
            <div>
                <h3> Atividades no Backlog</h3>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Chave</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Situação</TableCell>
                                <TableCell>Título</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderIssues()}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

BacklogIssues.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return { issues: state.backlog};
}

export default connect(mapStateToProps, { fetchBacklogIssues }) (withStyles(styles)(BacklogIssues));
