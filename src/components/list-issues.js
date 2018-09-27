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
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import FilterIssues from './filter-issues';
import Issue from './issue';
import {connect} from "react-redux";
import {fetchIssueList} from "../actions";
import Grid from "@material-ui/core/Grid/Grid";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        }
    },
    progress: {
        margin: theme.spacing.unit * 2,
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
    modal: {
        position: 'absolute',
        width: '80%',
        height: '80%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit,
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
            modalOpen: false,
            modalIssue: null,
            loading: false
        };

        if (this.props.fetchIssues === "backlog"){
            this.fetchIssues = this.props.fetchIssueList;
        }
    }

    handleUpdate = (jql = '') => {
        if(jql !== '' && this.fetchIssues){
            this.setState({ loading: true });
            this.fetchIssues(jql).then(response => {
                let data;
                if (this.props.fetchIssues === "backlog"){
                    data = this.props.issue_list;
                }
                this.setState({
                    data,
                    loading: false
                });
            }).catch(error => {
                this.setState({ loading: false });
                alert("Não foi possível realizar a consulta");
                console.log("Request error", error);
            });
        }
    };

    componentDidMount(){
        //this.handleUpdate();
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

    handleModalOpen = (issue) => {
        this.setState(
            {
                modalOpen: true,
                modalIssue: issue
            }
        );
    };

    handleModalClose = () => {
        this.setState(
            {
                modalOpen: false,
                modalIssue: null
            }
        );
    };

    render (){

        const { classes } = this.props;
        const { data, order, orderBy, rowsPerPage, page, loading } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        const columnData = [
            { id: 'id', numeric: false, disablePadding: false, label: 'Chave' },
            { id: 'groupComponents', numeric: false, disablePadding: false, label: 'Grupo' },
            { id: 'issuetype', numeric: false, disablePadding: false, label: 'Tipo' },
            { id: 'summary', numeric: false, disablePadding: false, label: 'Resumo' },
            { id: 'status', numeric: false, disablePadding: false, label: 'Situação' },
            { id: 'groupFixVersions', numeric: false, disablePadding: false, label: 'Versão de Liberação' },
            { id: 'storyPoints', numeric: false, disablePadding: false, label: 'Pontos' },
            { id: 'priorityId', numeric: false, disablePadding: false, label: 'Prioridade' },
        ];

        function renderIssues(owner){
            return data.sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map( issue => {
                    return(
                        <TableRow hover className={classes.tableRow} key={issue.key} >
                            <TableCell component="th" scope="row">
                                <a href={`/issue/${issue.key}`} target={'_blank'}> {issue.key}</a>
                            </TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.groupComponents}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.issuetype}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.summary}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.status}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.groupFixVersions}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.storyPoints ? issue.storyPoints : ''}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.priority ? issue.priority.name : ''}</TableCell>
                        </TableRow>
                    );
                }
            );
        }

        function getModalStyle() {
            const top = 50;
            const left = 50;

            return {
                top: `${top}%`,
                left: `${left}%`,
                transform: `translate(-${top}%, -${left}%)`,
                overflowY: 'auto',
            };
        }

        return (
            <div>
                <div>
                    <FilterIssues
                        onChangeFilter={this.handleUpdate}
                    />
                </div>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="title" id="tableTitle">
                            {this.props.title}
                        </Typography>
                    </div>
                    <div className={classes.spacer} />
                    {/*<Tooltip title="Filtro">*/}
                        {/*<IconButton aria-label="Filtro">*/}
                            {/*<FilterListIcon />*/}
                        {/*</IconButton>*/}
                    {/*</Tooltip>*/}
                </Toolbar>
                <Grid container spacing={16} justify={"center"}>
                    <Grid>
                        {
                            loading && (<CircularProgress className={classes.progress} size={50} />)
                        }
                    </Grid>
                </Grid>
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
                            {renderIssues(this)}
                            {emptyRows > 0 && (

                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6}>

                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage="Itens por pagina:"
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
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.modalOpen}
                    onClose={this.handleModalClose}
                >
                    <div style={getModalStyle()} className={classes.modal}>
                        <Issue
                            issueObj={this.state.modalIssue}
                            onIssueChange={(issue) => {
                                this.state.modalIssue.priority = issue.priority;
                                this.setState({data});
                            }}
                        >
                        </Issue>
                    </div>
                </Modal>
            </div>
        );
    }
}

ListIssues.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchIssues: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

function mapStateToProps({issue_list}) {
    return {
        issue_list,
    };
}

export default connect(mapStateToProps, { fetchIssueList }) (withStyles(styles)(ListIssues));