const lightSizeStyle = {
  padding: '5px',
  borderRadius: '5px',
  width: "90px",
  fontSize: "20px",
  fontWeight: 'bold',
  display: 'inline-block',
  marginRight: '10px',
  color: 'black'
};

export function LightProcessSize(props) {
	return (
	  <div
	    style={{
	      ...lightSizeStyle,
	      ...(props.isUpdating ? {
	        backgroundColor: 'rgb(220,220,100)'
	      } : {
	        backgroundColor: 'silver'
	      })
	    }}
	  >
	    {props.size}
	  </div>
  );
}

const darkSizeStyle = {
  paddingLeft: '4px',
  paddingRight: '4px',
  borderRadius: '4px',
  width: "80px",
};

export function DarkProcessSize(props) {
	return (
	  <div
	    style={{
	      ...darkSizeStyle,
	      ...(props.isUpdating ? {
	        color: 'yellow',
	        backgroundColor: 'rgb(50, 50, 50)'
	      } : {
	        color: 'white',
	        backgroundColor: 'rgb(64, 64, 64)'
	      })
	    }}
	  >
	    {props.size}
	  </div>
  );
}