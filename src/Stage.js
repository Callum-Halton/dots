
export default function Stage(props) {
	let stageStyle = {
		height: "100vh",
		backgroundColor: "grey",//props.blackBackground ? "white" : "black",
		flex: "1 1 auto",
		marginTop: "2px",
		marginBottom: "2px",
	};
	return(
		<div style={stageStyle}></div>
	);
}