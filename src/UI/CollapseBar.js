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
        <div>
          <FontAwesomeIcon icon={icon} style={iconStyle}/>
          {title}
        </div>
        <span style={{fontStyle: "italic", color: "lightGrey"}}>
          click me
        </span>
        <FontAwesomeIcon
          icon={ open === top ? faChevronUp : faChevronDown }
          style={iconStyle}
        />
      </button>
    );
}