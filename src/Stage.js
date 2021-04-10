import React, { Component } from 'react';
import MagnificationInput from './MagnificationInput.js';

const stageStyle = {
	height: "100vh",
	backgroundColor: "grey",//props.blackBackground ? "white" : "black",
	flex: "1 1 auto",
	marginTop: "2px",
	marginBottom: "2px",
};

export default class Stage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// short for magnifications
			mags: {
				source: 10,
				art: 1,
			}
		};
		this.changeMag = this.changeMag.bind(this);
	}

	changeMag(imageTab, newMag) {
		if (newMag >= 1) {
			this.setState(prevState => ({
				...prevState,
				mags: {
					...prevState.mags,
					[imageTab]: newMag
				}
			}));
		}
	}

	render() {
		let { props } = this;
		return(
			<div style={stageStyle}>
				<div style={{ float: "left", backgroundColor: "black", padding: "50px" }}>
					<MagnificationInput
		        mag={this.state.mags.source}
		        changeMag={newMag => this.changeMag('source', newMag)}
		      />
				</div>
			</div>
		);
	}
}