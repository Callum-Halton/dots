import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

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
  	width: 90,
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey',
      },
      '&:hover fieldset': {
        borderColor: 'rgb(64, 64, 64)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField);

export default function IntegerInput(props) {
  return (
	<CustomTextField
	  size="small"
	  label="Integer"
	  InputLabelProps={{
	    shrink: true,
	  }}
	  variant="outlined"
	  disabled={props.disabled}
	  value={props.val}
	  onChange={e => props.changeOptionVal(Number(e.target.value))}
    autoComplete='off'
    InputProps={{
      inputComponent: NumberFormatCustom,
    }}
    name="numberformat"
	/>
  );
}