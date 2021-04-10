import OptionCard from './OptionCard.js';
import CollapseBar from './CollapseBar.js';
import { faBullseye, faSprayCan } from '@fortawesome/free-solid-svg-icons';
import ActionButton from './ActionButton.js';

const optionsTableStyle = {
	borderCollapse: "collapse",
	backgroundColor: "white",
};

const panelContainerStyle = {
	margin: "20px",
	marginTop: "10px",
	marginBottom: "10px",
}

const optionsTableBodyStyle = {
	display: "block",
	maxHeight: `calc(100vh - ${60 + 2*4 + 2*33 + 2*10 + 52}px)`,
	overflow: "scroll",
};

export default function OptionsPanel(props) {
	let optionCards = [];
	let { relevantOptions, optionGroupKey } = props;
	let first = true;
	for (let optionKey in relevantOptions) {
		let option = relevantOptions[optionKey];
		let greyed = option.dependencyKey === null ? false :
			relevantOptions[option.dependencyKey].val === option.dependencyValToGrey;

		let { hideWhenGrey } = option;
		if (!(hideWhenGrey && greyed)) {
			optionCards.push(
				<OptionCard
					name={option.name}
					val={option.val}
					intOptionInfo={option.intOptionInfo}
					greyedPrefix={option.greyedPrefix}
					key={optionKey}
					greyed={greyed || option.disabled}
					normallyHidden={hideWhenGrey}
					changeOptionVal={
						val => props.changeOptionVal(optionGroupKey, optionKey, val)
					}
					first={first}
				/>
			)
		}
		first = false;
	}

	let icon = optionGroupKey === 'sample' ? faBullseye : faSprayCan;
	let panelElements = [
  	<CollapseBar
  		icon={icon}
  		optionGroupKey={optionGroupKey}
  		togglePanel={props.togglePanel}
  		open={props.open}
  		top={props.top}
  		key="CollapseBar"
  	/>
	];

	if (props.open) {
		panelElements.splice(props.top ? 0 : 1, 0 ,
			<div style={panelContainerStyle} key="panelContainer">
				<ActionButton
					actionCall={props.actionCall}
					optionGroupKey={optionGroupKey}
					icon={icon}
					key="ActionButton"
				/>
				<table style={optionsTableStyle} key="optionsCards">
					<tbody style={optionsTableBodyStyle}>{optionCards}</tbody>
	  		</table>
	  	</div>
  	);
	}
  return (
  	<div style={{flex: "0 0 auto"}}>{panelElements}</div>
  );

}