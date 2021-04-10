import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const CustomTextField = withStyles({
  root: {
  	color: "red",
  	width: 110,
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey',
      },
      '&:hover fieldset': {
        borderColor: 'grey',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputAdornment-root': {
    	color: 'red'
    }
  },
})(TextField);

const CustomInputAdornment = withStyles({
	root: {
		color: 'white',
	}
})(InputAdornment);

export default function MagnificationInput(props) {
  return (
	<CustomTextField
	  //size="small"
	  label="Magnification"
	  type="number"
	  InputLabelProps={{
	    shrink: true,
	  }}
	  variant="outlined"
    InputProps={{
      startAdornment: <CustomInputAdornment position="start">%</CustomInputAdornment>,
    }}
	  value={Math.round(props.mag * 100)}
	  onChange={e => props.changeMag(Number(e.target.value) / 100)}
	/>
  );
}