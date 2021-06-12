import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt,
         faImages,
         faFileImage,
         faWindowClose,
       } from '@fortawesome/free-solid-svg-icons';

const iconsByAction = {
  select: faFileImage,
  cancel: faWindowClose,
  replace: faImages,
  download: faCloudDownloadAlt,
};

const ColorButton = withStyles((theme) => ({
  root: {
    width: 140,
  	fontWeight: 'bold',
  	backgroundColor: 'lightGrey',
    color: 'black',
    '&:hover': {
      backgroundColor: 'grey',
    },
  },
}))(Button);

export default function StageButton(props) {
  let { action } = props;
	return (
		<ColorButton
			onClick={props.actionCall}
			startIcon={<FontAwesomeIcon icon={iconsByAction[action]}/>}
		>
    {action.toUpperCase()}
    </ColorButton>
	);
}