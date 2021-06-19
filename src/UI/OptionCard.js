import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IntegerInput from './IntegerInput.js';
import IntegerSlider from './IntegerSlider.js';


const BlackCheckbox = withStyles({
  root: { color: "black" }
})((props) => <Checkbox color="default" {...props} />);

const blackStyle = {
	color: "black",
	fontWeight: "bold",
}

const greyStyle = {
	color: "grey",
	fontWeight: "normal",
}

export default function OptionCard(props) {
	let { val, greyedPrefix, greyed, changeOptionVal, intOptionInfo} = props;

	let borderTop;
	let nameStyle = {
		padding: "20px",
		width: "calc(50vw - 120px)",
	};

	let icon = null;
	if (props.normallyHidden) {
		borderTop = "none";
		icon =
			<FontAwesomeIcon
				icon={faCaretRight}
				style={{color: "grey", marginRight: "30px"}}
			/>;
		nameStyle = {...nameStyle, ...{paddingTop: "5px"}};
	} else {
		borderTop = props.first ? "none" : "2px solid grey";
	}

	let rowStyle = {
		borderTop: borderTop,
		fontSize: "20px",
	};

	let disabled = greyed && !greyedPrefix;
	let input;
 	if (intOptionInfo) {
 		if (intOptionInfo.showSlider) {
 			input =
		 		<IntegerSlider
		 			val={val}
		 			min={intOptionInfo.min}
		 			max={intOptionInfo.max}
		 			disabled={disabled}
		 			changeOptionVal={changeOptionVal}
	 			/>
 		} else {
 			input =
	 			<IntegerInput
	        disabled={props.disabled}
	        val={val}
	        changeOptionVal={props.changeOptionVal}
	      />
 		}
 	} else {
 		input =
			<BlackCheckbox
  			checked={val}
  			disabled={disabled}
  			onChange={() => changeOptionVal(!val)}
	    />;
	}

  return (
    <tr style={rowStyle}>
    	<td style={nameStyle} >
    		{icon}
    		<span style={greyed ? greyStyle : blackStyle} >
    			{greyedPrefix}
    		</span>
    		<span style={disabled ? greyStyle : blackStyle} >
    			{props.name}
    		</span>
    	</td>
    	<td>
    		{input}
    	</td>
    </tr>
  );
}