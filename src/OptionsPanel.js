import OptionCard from './OptionCard.js';
import CollapseBar from './CollapseBar.js';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { faPenNib } from '@fortawesome/free-solid-svg-icons'

const optionsTableStyle = {
	margin: "20px",
	marginTop: "10px",
	marginBottom: "10px",
	borderCollapse: "collapse",
	backgroundColor: "white",
};

// 60 + 2(4) +
const optionsTableBodyStyle = {
	display: "block",
	maxHeight: `calc(100vh - ${50 + 2*4 + 2*33 + 2*10}px)`,
	overflow: "scroll",
};

export default function OptionsPanel(props) {
	let optionCards = [];
	let { relevantOptions, extraDependencies} = props;
	let first = true;
	for (let optionKey in relevantOptions) {

		let option = relevantOptions[optionKey];
		let greyed = option.dependencyKey === null ? false :
			{...relevantOptions, ...extraDependencies}[option.dependencyKey].val
			=== option.dependencyValToGrey;

		let { hideWhenGrey } = option;
		if (!(hideWhenGrey && greyed)) {
			optionCards.push(
				<OptionCard
					name={option.name}
					val={option.val}
					intOptionInfo={option.intOptionInfo}
					greyedPrefix={option.greyedPrefix}
					key={optionKey}
					greyed={greyed}
					normallyHidden={hideWhenGrey}
					changeOptionVal={val => props.changeOptionVal(optionKey, val)}
					first={first}
				/>
			)
		}
		first = false;
	}

	let icon = props.title === 'Sampling' ? faServer : faPenNib;
	let componentElements = [
  	<CollapseBar
  		icon={icon}
  		title={props.title}
  		togglePanel={props.togglePanel}
  		open={props.open}
  		top={props.top}
  		key="CollapseBar"
  	/>
	];

	if (props.open) {
		componentElements.splice(props.top ? 0 : 1, 0 ,
			<table style={optionsTableStyle} key="optionsCards">
				<tbody style={optionsTableBodyStyle}>{optionCards}</tbody>
  		</table>
  	);
	}
  return (
  	<div style={{flex: "0 0 auto"}}>{componentElements}</div>
  );

}