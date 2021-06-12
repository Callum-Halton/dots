import React, { Fragment } from "react";
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import IntegerInput from './IntegerInput.js';


const CustomSlider = withStyles({
  root: {
    color: 'black',
    height: 2,
    width: "calc(50vw - 120px)",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 7,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: 'black',
    marginTop: -9,
    marginLeft: -9,
    '&:focus, &:hover, &$active': {
      backgroundColor: "rgb(64, 64, 64)",
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
    },
  },
  active: {},
  track: {
    height: 2,
    backgroundColor: 'black',
  },
  rail: {
    height: 2,
    backgroundColor: 'black',
  },
  mark: {
    backgroundColor: 'grey',
    height: 8,
    width: 2,
    marginTop: -3,
  },
  markActive: {
    backgroundColor: 'black',
  },
})(Slider);

export default function IntegerSlider(props) {
  return (
    <Fragment>
      <CustomSlider
        onChange={(e, newVal) => props.changeOptionVal(newVal)}
        value={props.val}
        step={1}
        marks
        min={props.min}
        max={props.max}
        disabled={props.disabled}
      />
      <IntegerInput
        disabled={props.disabled}
        val={props.val}
        changeOptionVal={props.changeOptionVal}
      />
    </Fragment>
  );
}
