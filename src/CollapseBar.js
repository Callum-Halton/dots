import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './CollapseBar.css'

const iconStyle = {
	color: "white",
	marginLeft: "15px",
	marginRight: "20px",
}

export default function CollapseBar(props) {
	let {icon, togglePanel, open, top, optionGroupKey} = props;
	let title = props.optionGroupKey === 'sample' ? 'Sampling' : 'Rendering';
	return (
		<button onClick={() => togglePanel(optionGroupKey)} className="collapseBar">
			<FontAwesomeIcon
				icon={icon}
				style={{...iconStyle, ...{float: "left"}}}
			/>
			<span style={{marginRight: "calc(50vw - 150px"}}>{title}</span>
			<span
				style={{fontStyle: "italic", color: "rgba(255, 255, 255, 0.85)"}}
			>click me</span>
			<FontAwesomeIcon
				icon={ open === top ? faChevronUp : faChevronDown }
				style={{...iconStyle, ...{float: "right"}}}
			/>
		</button>
	);
}