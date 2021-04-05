import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const CustomTextField = withStyles({
  root: {
  	width: 110,
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
	  //id="outlined-number"
	  label="Integer"
	  type="number"
	  InputLabelProps={{
	    shrink: true,
	  }}
	  variant="outlined"
	  disabled={props.disabled}
	  value={props.val}
	  onChange={e => props.changeOptionVal(Number(e.target.value))}

	/>
  );
}