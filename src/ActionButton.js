import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ColorButton = withStyles((theme) => ({
  root: {
  	margin: 5,
  	fontWeight: 'bold',
  	backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: 'grey',
    },
  },
}))(Button);

export default function ActionButton(props) {
	return(
		<ColorButton
			onClick={props.actionCall}
			startIcon={<FontAwesomeIcon icon={props.icon}/>}
			size="large"
		>
    {`${props.optionGroupKey.toUpperCase()} NOW`}
    </ColorButton>
	);
}