import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LightProcessSize } from './ProcessSize.js';

const processWords = {
	sample: 'points sampled',
	render: 'dots rendered',
};

const textStyle = {
	fontSize: "20px",
	fontWeight: "bold",
	position: 'relative',
	top: '4px',
	marginLeft: '5px',
};

const msgGroupStyle = {
	display: 'inline-block',
};

const ActionButton = withStyles((theme) => ({
  root: {
  	margin: 5,
  	fontWeight: 'bold',
  	backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: 'grey',
     },
    '&:disabled': {
    	color: "lightGrey",
    	backgroundColor: "darkGrey",
    },
  },
}))(Button);

export default function ActionButtonETC(props) {
	let { optionGroupKey, processState } = props;
	return (
		<div>
			<ActionButton
				disabled={props.disabled}
				onClick={props.actionCall}
				startIcon={<FontAwesomeIcon icon={props.icon}/>}
				size="large"
			>
	    	{`${optionGroupKey.toUpperCase()} NOW`}
	    </ActionButton>
			{processState.progress ?
				<div style={{...textStyle, ...msgGroupStyle}}>
					<LightProcessSize
						isUpdating={processState.progress === 'started'}
						size={processState.size}
					/>
					<span>
						{processWords[optionGroupKey]}, {processState.progress === 'started'
							? 'so far...' : `${optionGroupKey} complete.`}
					</span>
				</div> : <span style={textStyle}> No {optionGroupKey} exists</span>
			}
	  </div>
	);
}