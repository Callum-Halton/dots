import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { TextField, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare,
         faMinusSquare } from '@fortawesome/free-regular-svg-icons';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      suffix="x"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const CustomTextField = withStyles({
  root: {
    width:100,
    '& .MuiInputBase-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root': {
      color: 'lightGrey',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey',
      },
      '&:hover fieldset': {
        borderColor: 'lightGrey',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  }
})(TextField);

export default function MagnificationInput(props) {
  return (
    <div>
      <CustomTextField
        style={{marginRight: "4px"}}
        label="Magnification"
        value={props.mag}
        onChange={e => props.changeMag(Number(e.target.value))}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        size="small"
        name="numberformat"
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
      />
      <MagnificationButton
        icon={faMinusSquare}
        onClick={() => props.changeMag(props.mag - 1)}
      />
      <MagnificationButton
        icon={faPlusSquare}
        onClick={() => props.changeMag(props.mag + 1)}
      />
    </div>
  );
}

const iconButtonStyle = {
  padding: "0px",
  margin: "3px",
  marginTop: "9px",
}

function MagnificationButton(props) {
  return (
    <IconButton style={iconButtonStyle} onClick={props.onClick}>
      <FontAwesomeIcon
        style={{color: "white", fontSize: "20px"}}
        icon={props.icon}
      />
    </IconButton>
  );
}