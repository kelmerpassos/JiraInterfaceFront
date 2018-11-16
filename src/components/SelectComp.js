import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from "@material-ui/core/Input/Input";

const styles = theme => ({
    formControl: {
        marginTop: '-5px',
        marginLeft: '5px',
        minWidth: 120,
    },
    select: {
        width: 250,
    },
    menuItem: {
        width: 300
    }
});

const ITEM_HEIGHT = 48,
      ITEM_PADDING_TOP = 8,
      MenuProps = {
          PaperProps: {
              style: {
                  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                  width: 300,
              },
          },
      };

class SelectComp extends Component {

    constructor(props) {
        super(props);

        if(!props.multipleSelection){
            const index = props.listValues ? props.listValues.findIndex(obj => obj[props.valueProp] === props.value[props.valueProp]) : -1;

            this.state = {
                value: props.value,
                index: index,
            };
        }else{
            let selectedValues = [],
                selecteds = [];

            for(let i = 0; i < props.value.length; i++){
                selectedValues.push(props.value[i][props.valueProp]);
                selecteds.push(props.value[i]);
            }

            this.state = {
                selectedValues,
                selecteds,
            };
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMultiSelect = this.handleChangeMultiSelect.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.props.multipleSelection){
            if(prevProps.value[this.props.valueProp] !== this.state.value[this.props.valueProp] ||
                (prevProps.listValues ? prevProps.listValues.length: 0) !== (this.props.listValues ? this.props.listValues.length : 0)){
                const index = this.props.listValues ? this.props.listValues.findIndex(obj => obj[this.props.valueProp] === prevProps.value[this.props.valueProp]) : -1;
                this.setState({
                    index,
                    value: prevProps.value,
                });
            }
        }else{

            let changed = this.props.value.length !== this.state.selecteds.length;

            if(!changed){
                let objList = JSON.parse(JSON.stringify(this.state.selecteds)),
                    obj;

                for(let i = 0; i < this.props.value.length; i++){
                    obj = objList.find((option, index, array) => {
                        option.index = index;
                        return option[this.props.valueProp] === this.props.value[i][this.props.valueProp]
                    });

                    if(obj){
                        objList.splice(obj.index, 1);
                    }
                }

                changed = objList.length > 0;
            }

            if(changed){
                let selectedValues = [],
                    selecteds = [];

                for(let i = 0; i < this.props.value.length; i++){
                    selectedValues.push(this.props.value[i][this.props.valueProp]);
                    selecteds.push(this.props.value[i]);
                }

                this.setState({
                    selectedValues,
                    selecteds,
                });
            }
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

    handleChangeMultiSelect = (event) => {
        let selected = null,
            selecteds = event.target.value.map( value => {
                selected = this.props.listValues.find((option, index, array) => {
                    return option[this.props.valueProp] === value
                });
                return selected ? selected : null;
            } );

        this.setState( {
            selecteds,
            selectedValues: event.target.value,
        });

        this.props.updateValue(selecteds);
    };

    render (){
        const { classes, theme } = this.props;

        return (
            <div>
                <FormControl className={classes.formControl}>
                    {
                        !this.props.multipleSelection && (
                            <Select
                                value={this.state.index}
                                onChange={this.handleChange}
                            >
                                {/*<MenuItem value={"-1"}>*/}
                                {/*{'Não Selecionado'}*/}
                                {/*</MenuItem>*/}

                                {this.props.listValues && (this.props.listValues.map((option, index) => (
                                    <MenuItem key={index} value={index}>
                                        {option[this.props.valueProp]}
                                    </MenuItem>
                                )))}
                            </Select>
                        )
                    }

                    {
                        this.props.multipleSelection && (
                            <Select
                                multiple
                                className={classes.select}
                                value={this.state.selectedValues}
                                onChange={this.handleChangeMultiSelect}
                                renderValue={value => value.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {this.props.listValues && (this.props.listValues.map((option, index) => (
                                    <MenuItem className={classes.menuItem} key={index} value={option[this.props.valueProp]}>
                                        <Checkbox checked={this.state.selectedValues.indexOf(option[this.props.valueProp]) > -1} />
                                        <ListItemText primary={option[this.props.valueProp]} />
                                    </MenuItem>
                                )))}
                            </Select>
                        )
                    }
                </FormControl>
            </div>
        );
    }
}

SelectComp.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    listValues: PropTypes.array,
    updateValue: PropTypes.func,
    valueProp: PropTypes.string,
    multipleSelection: PropTypes.any,
};

export default withStyles(styles, { withTheme: true })(SelectComp);
