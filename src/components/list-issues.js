import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import TablePagination from '@material-ui/core/TablePagination';

import {connect} from "react-redux";
import {fetchBacklogIssues, fetchSprintIssues} from "../actions";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}


class ListIssues extends Component{

    constructor(props) {
        super(props);

        this.state = {
            order: 'asc',
            orderBy: 'id',
            page: 0,
            rowsPerPage: 10,
            data: [],
        };
    }

    componentDidMount(){

        let fetchIssues = null;

        if(this.props.fetchIssues === "sprint"){
            fetchIssues = this.props.fetchSprintIssues;
        } else if (this.props.fetchIssues === "backlog"){
            fetchIssues = this.props.fetchBacklogIssues;
        }

        if(fetchIssues){
            fetchIssues().then(response => {
                const data = this.props.issues; //response.payload.data;
                this.setState({ data });
            });
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        const data =
            order === 'desc'
                ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
                : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

         this.setState({ data, order, orderBy });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render (){

        const { classes } = this.props;
        const { data, order, orderBy, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        const columnData = [
            { id: 'id', numeric: false, disablePadding: false, label: 'Chave' },
            { id: 'groupComponents', numeric: false, disablePadding: false, label: 'Grupo' },
            { id: 'issuetype', numeric: false, disablePadding: false, label: 'Tipo' },
            { id: 'status', numeric: false, disablePadding: false, label: 'Situação' },
            { id: 'summary', numeric: false, disablePadding: false, label: 'Resumo' },
        ];

       function renderIssues(){
            return data.sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map( issue => {
                    return(
                        <TableRow key={issue.key}>
                            <TableCell component="th" scope="row">
                                {issue.key}
                            </TableCell>
                            <TableCell>{issue.groupComponents}</TableCell>
                            <TableCell>{issue.issuetype}</TableCell>
                            <TableCell>{issue.status}</TableCell>
                            <TableCell>{issue.summary}</TableCell>
                        </TableRow>
                    );
                });
        }


        return (
            <div>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="title" id="tableTitle">
                            Atividades na Sprint
                        </Typography>
                    </div>
                    <div className={classes.spacer} />
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <Paper className={classes.root}>
                    <Table aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                {columnData.map(column => {
                                    return (
                                        <TableCell
                                            key={column.id}
                                            numeric={column.numeric}
                                            padding={column.disablePadding ? 'none' : 'default'}
                                            sortDirection={orderBy === column.id ? order : false}
                                        >
                                            <Tooltip
                                                title="Ordenar"
                                                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                                enterDelay={300}
                                            >
                                                <TableSortLabel
                                                    active={orderBy === column.id}
                                                    direction={order}
                                                    onClick={(event) => this.handleRequestSort(event, column.id)}
                                                >
                                                    {column.label}
                                                </TableSortLabel>
                                            </Tooltip>
                                        </TableCell>
                                    );
                                }, this)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderIssues()}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        );
    }
}

ListIssues.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchIssues: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
    let resp = {};

    if(state.sprint.length > 0){
        resp = state.sprint;
    }else if(state.backlog.length > 0){
        resp = state.backlog;
    }

    return { issues: resp};
}

export default connect(mapStateToProps, { fetchSprintIssues, fetchBacklogIssues }) (withStyles(styles)(ListIssues));