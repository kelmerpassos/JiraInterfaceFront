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
import Dashboard from '@material-ui/icons/Dashboard';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';

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
    paper:{
        marginTop: '10px',
        marginBottom: '20px',
    }
});

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

function countIssues(data) {
    let total = {
            departmentsPoints: [],
            productOwnersPoints: [],
            totalPoints: 0,
            totalIssues: 0,
            selectedProductOwner: null,
        },
        issue;

    total.totalIssues = data.length;

    for(let i = 0; i < data.length; i++){
        issue = data[i];

        total.totalPoints += issue.storyPoints;

        if(!total.selectedProductOwner){
            total.selectedProductOwner = issue.productOwner.id;
        }

        if(!total.productOwnersPoints[issue.productOwner.id]){
            total.productOwnersPoints[issue.productOwner.id] = {
                id: issue.productOwner.id,
                value: issue.productOwner.value,
                storyPoints: 0,
                totalIssues: 0,
                issues: [],
            };
        }

        total.productOwnersPoints[issue.productOwner.id].totalIssues++;
        total.productOwnersPoints[issue.productOwner.id].storyPoints += issue.storyPoints;
        total.productOwnersPoints[issue.productOwner.id].issues.push(issue);

        issue.departments.forEach(department => {
            if(!total.departmentsPoints[department.id]){
                total.departmentsPoints[department.id] = {
                    id: department.id,
                    value: department.value,
                    storyPoints: 0,
                    pointsAverage: 0,
                    totalIssues: 0,
                    totalIssuesAverage: 0
                };
            }

            total.departmentsPoints[department.id].pointsAverage +=  Math.round(issue.storyPoints/issue.departments.length);
            total.departmentsPoints[department.id].totalIssuesAverage++;

            if(issue.departments.length === 1){
                total.departmentsPoints[department.id].storyPoints += issue.storyPoints;
                total.departmentsPoints[department.id].totalIssues++;
            }
        });
    }

    return total;
}

class ListIssues extends Component{

    constructor(props) {
        super(props);

        this.state = {
            order: 'asc',
            orderBy: 'id',
            page: 0,
            rowsPerPage: 25,
            data: [],
            modalOpen: false,
            modalIssue: null,
            modalDepartmentsPointsOpen: false,
            loading: false,
            departmentsPoints: [],
            productOwnersPoints: [],
            selectedProductOwner: null,
            totalPoints: 0,
            totalIssues: 0,
            tabValue: 0,
        };

        if (this.props.fetchIssues === "backlog"){
            this.fetchIssues = this.props.fetchIssueList;
        }

        localStorage.removeItem('prevPath');
    }

    componentDidMount() {

        let data = this.props.issue_list ? this.props.issue_list : [],
            total;

        if(!this.props.issue_list){
            data = localStorage.getItem('issue_list');

            if(data){
                data = JSON.parse(data);
            }else{
                data = [];  
            }
        }

        total = countIssues(data);

        this.setState({
            data,
            departmentsPoints: total.departmentsPoints,
            productOwnersPoints: total.productOwnersPoints,
            totalPoints: total.totalPoints,
            totalIssues: total.totalIssues,
            selectedProductOwner: total.selectedProductOwner,
        });
    }

    handleUpdate = (jql = '') => {
        if(!this.state.loading && jql !== '' && this.fetchIssues){
            this.setState({ loading: true });
            this.fetchIssues(jql).then(response => {
                let data, total;

                if (this.props.fetchIssues === "backlog"){
                    data = this.props.issue_list;
                }

                total = countIssues(data);

                this.setState({
                    data,
                    loading: false,
                    departmentsPoints: total.departmentsPoints,
                    productOwnersPoints: total.productOwnersPoints,
                    totalPoints: total.totalPoints,
                    totalIssues: total.totalIssues,
                    selectedProductOwner: total.selectedProductOwner,
                });

            }).catch(error => {
                this.setState({ loading: false });
                if(error.response.status !== 401) {
                    alert("Não foi possível realizar a consulta");
                    console.log("Request error", error);
                }else{
                    this.props.notAuthCall(error);
                }
            });
        }
    };

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

    handleClickDepartmentsPointsOpen = () => {
        if(this.state.departmentsPoints && this.state.departmentsPoints.length > 0){
            this.setState(
                {
                    modalDepartmentsPointsOpen: true,
                }
            );
        }
    };

    handleModalDepartmentsPointsClose = () => {
        this.setState(
            {
                modalDepartmentsPointsOpen: false,
            }
        );
    };

    handleTabChange = (event, tabValue) => {
        this.setState({ tabValue });
    };

    render (){

        const { classes } = this.props;
        const { data, order, orderBy, rowsPerPage, page, loading, tabValue } = this.state;

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

        function renderIssues(owner){
            return data.sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map( issue => {
                    return(
                        <TableRow hover className={classes.tableRow} key={issue.key} >
                            <TableCell component="th" scope="row">
                                <Link to={`/issue/${issue.key}`}> {issue.key}</Link>
                            </TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.groupDepartments}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.issuetype}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.summary}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.status}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.groupFixVersions}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.storyPoints ? issue.storyPoints : ''}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.priority ? issue.priority.name : ''}</TableCell>
                            <TableCell onClick={(event) => owner.handleModalOpen(issue)}>{issue.sprint ? issue.sprint.name : ''}</TableCell>
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

        function renderProductOwnersPointsRows(productOwnersPoints, self){
            return productOwnersPoints.map(productOwner => {

                return (
                    <TableRow hover className={classes.tableRow}
                              key={productOwner.id}
                              onClick={() => {
                                  self.setState({
                                      selectedProductOwner: productOwner.id
                                  })
                              }}
                    >
                        <TableCell>{productOwner.value}</TableCell>
                        <TableCell>{productOwner.totalIssues}</TableCell>
                        <TableCell>{productOwner.storyPoints}</TableCell>
                    </TableRow>
                );
            });
        }

        function renderProductOwnersIssuesRows(issueList, self){
            return issueList[self.state.selectedProductOwner].issues.map(issue => {
                return (
                    <TableRow hover className={classes.tableRow} key={issue.key} >
                        <TableCell component="th" scope="row">
                            <Link to={`/issue/${issue.key}`}> {issue.key}</Link>
                        </TableCell>
                        <TableCell>{issue.summary}</TableCell>
                        <TableCell>{issue.storyPoints}</TableCell>
                    </TableRow>
                );
            });
        }

        function renderDepartmentPointsRows(departmentsPoints){
            return departmentsPoints.map(department => {
                return (
                    <TableRow hover className={classes.tableRow} key={department.id} >
                        <TableCell>{department.value}</TableCell>
                        <TableCell>{department.totalIssues}</TableCell>
                        <TableCell>{department.storyPoints}</TableCell>
                        <TableCell>{department.totalIssuesAverage}</TableCell>
                        <TableCell>{department.pointsAverage}</TableCell>
                    </TableRow>
                );
            });
        }

        return (
            <div>
                <div>
                    <FilterIssues
                        onChangeFilter={this.handleUpdate}
                        notAuthCall={this.props.notAuthCall}
                    />
                </div>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="title" id="tableTitle">
                            {this.props.title}
                            <IconButton
                                color={"primary"}
                                onClick={this.handleClickDepartmentsPointsOpen}>
                                <Dashboard/>
                            </IconButton>
                        </Typography>
                        <Modal
                            aria-labelledby="simple-modal-title2"
                            aria-describedby="simple-modal-description2"
                            open={this.state.modalDepartmentsPointsOpen}
                            onClose={this.handleModalDepartmentsPointsClose}
                        >
                            <div style={getModalStyle()} className={classes.modal}>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={16}>
                                        <Grid item sm={6}>
                                            <Typography variant={"subheading"} align={"center"}>
                                                Qtd. Atividades: {this.state.totalIssues}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Typography variant={"subheading"} align={"center"}>
                                                Total Pontos: {this.state.totalPoints}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Paper>
                                    <Tabs
                                        value={tabValue}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        onChange={this.handleTabChange}
                                    >
                                        <Tab label="Departamento" />
                                        <Tab label="Product Owner" />
                                    </Tabs>
                                    {
                                        tabValue === 0 && (
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant={"subheading"}>
                                                                Departamento
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant={"subheading"}>
                                                                Qtd. Departamento
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant={"subheading"}>
                                                                Pontos
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant={"subheading"}>
                                                                Qtd. Compartilhada
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant={"subheading"}>
                                                                Pontos com Rateio
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {renderDepartmentPointsRows(this.state.departmentsPoints)}
                                                </TableBody>
                                            </Table>
                                        )
                                    }
                                    {
                                        tabValue === 1 && (
                                            <Grid container spacing={16}>
                                                <Grid item md={6}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Typography variant={"subheading"}>
                                                                        Product Owner
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant={"subheading"}>
                                                                        Qtd. Atividades
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant={"subheading"}>
                                                                        Pontos
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {renderProductOwnersPointsRows(this.state.productOwnersPoints, this)}
                                                        </TableBody>
                                                    </Table>
                                                </Grid>
                                                <Grid item md={6} >
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
                                                                        Pontos
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {renderProductOwnersIssuesRows(this.state.productOwnersPoints, this)}
                                                        </TableBody>
                                                    </Table>
                                                </Grid>
                                            </Grid>
                                        )
                                    }

                                </Paper>
                            </div>
                        </Modal>
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
                            {/*{emptyRows > 0 && (*/}

                                {/*<TableRow style={{ height: 49 * emptyRows }}>*/}
                                    {/*<TableCell colSpan={6}>*/}

                                    {/*</TableCell>*/}
                                {/*</TableRow>*/}
                            {/*)}*/}

                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions = {[25,50,100,200]}
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
    notAuthCall: PropTypes.func.isRequired,
};

function mapStateToProps({issue_list}) {
    return {
        issue_list,
    };
}

export default connect(mapStateToProps, { fetchIssueList }) (withStyles(styles)(ListIssues));