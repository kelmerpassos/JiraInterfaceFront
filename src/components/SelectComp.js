import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
    formControl: {
        marginTop: '-5px',
        marginLeft: '5px',
        minWidth: 120,
    },
});

class SelectComp extends Component {

    constructor(props) {
        super(props);

        const index = this.props.listValues ? this.props.listValues.findIndex(obj => obj.id === props.value.id) : -1;

        this.state = {
            value: props.value,
            index: index,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.value.id !== this.state.value.id){
            const index = this.props.listValues ? this.props.listValues.findIndex(obj => obj.id === prevProps.value.id) : -1;
            this.setState({
                index,
                value: prevProps.value,
            });
        }
    }

    handleChange = (event) => {
        const obj = this.props.listValues[event.target.value];

        this.setState({
            index: event.target.value,
            value: obj,
        });
        this.props.updateValue(obj);
    };

    render (){
        const { classes, theme } = this.props;
        return (
            <div>
                <FormControl className={classes.formControl}>
                    <Select
                        value={this.state.index}
                        onChange={this.handleChange}
                    >
                        <MenuItem value={"-1"}>
                            {'Não Selecionado'}
                        </MenuItem>

                        {this.props.listValues && (this.props.listValues.map((option, index) => (
                            <MenuItem key={index} value={index}>
                                {option.name}
                            </MenuItem>
                        )))}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

SelectComp.propTypes = {
    classes: PropTypes.object.isRequired,
    listValues: PropTypes.array,
    updateValue: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(SelectComp);
