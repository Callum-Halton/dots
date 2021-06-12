import React, { Component, Fragment } from 'react';
import MagnificationInput from './MagnificationInput.js';
import StageButton from './StageButton.js';
import ImageTabs from './ImageTabs.js';

const stageControlsStyle = {
  marginTop: "2px",
};

const toolsStyle = {
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "black",
  padding: "10px",
  color: "lightGrey",
  fontSize: "20px",
}

const containerStyle = {
  flexGrow : 1,
  display: "flex",
  backgroundColor: "rgb(30, 30, 30)",
  flexDirection: "column",
  justifyContent: "center",
  overflow: "scroll",
  marginBottom: "2px"
}

export default class Stage extends Component {

  static actionsByTab = {
    select: 'select',
    source: 'replace',
    art: 'download',
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.canvasRefs = {
      source: null,
      art: null,
    }

    this.state = {
      sourceImageProvided: false,
      activeTab: 'select',
      // short for magnifications
      mags: {
        source: 1,
        art: 1,
      }
    };
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.changeMag = this.changeMag.bind(this);
    this.select = this.select.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.download = this.download.bind(this);
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

  changeActiveTab(newActiveTab) {
    this.setState({
      activeTab: newActiveTab,
    });
  }

  select() { document.getElementById('fileInput').click(); }

  handleFile(e) {
    this.setState({
      sourceImageProvided: true
    });
    this.props.changeSourceImage(e.target.files[0])
    this.changeActiveTab('source');
  }

  download() {
    console.log('downloaded')
  }

  areSimiliar(a, b) {
    if (b - 1 < a && a < b + 1) {
      return true
    }
    return false
  }

  componentDidUpdate() {
    let container = this.containerRef.current;
    let { activeTab } = this.state;
    let relevantMag = this.state.mags[activeTab];
    let relevantCanvas = this.canvasRefs[activeTab]
    if (container && relevantCanvas) {
      if (!this.areSimiliar(container.offsetWidth * relevantMag,
          relevantCanvas.offsetWidth) &&
          !this.areSimiliar(container.offsetHeight * relevantMag,
          relevantCanvas.offsetHeight)) {
        this.forceUpdate();
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.forceUpdate());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.forceUpdate());
  }

  setCanvasRef(tabType, ref) {
    this.canvasRefs[tabType] = ref;
    this.props.setCanvasRef(tabType, ref);
  }

  render() {
    let { activeTab, mags } = this.state;
    let relevantAction = Stage.actionsByTab[activeTab]

    let container = this.containerRef.current;
    let { sourceImageInfo } = this.props;
    let maxW, maxH;
    let canvasWidth;
    let canvasHeight
    if (container) {
      maxW = container.offsetWidth;
      maxH = container.offsetHeight;
      if (sourceImageInfo) {
        if ((sourceImageInfo.width / maxW) > (sourceImageInfo.height / maxH)) {
          canvasWidth = maxW;
          canvasHeight = sourceImageInfo.height * maxW / sourceImageInfo.width;
        } else {
          canvasWidth = sourceImageInfo.width * maxH / sourceImageInfo.height;
          canvasHeight = maxH;
        }
      }
    }

    let canvases = ['source', 'art'].map(tabType => {
      let relevantMag = mags[tabType];
      return (
        <canvas
          style={{
            display: activeTab === tabType ? 'block' : "none",
            width: canvasWidth ? `${canvasWidth * relevantMag}px` : `${maxW}px`,
            height: canvasHeight ? `${canvasHeight * relevantMag}px`
              : `${maxH}px`,
            margin: "0 auto",
          }}
          ref={ref => this.setCanvasRef(tabType, ref)}
          key={`${tabType}Canvas`}
        />
      );
    });

    return (
      <Fragment>
        <div style={stageControlsStyle}>
          {activeTab === 'select' ?
            <div
              style={{width: "100%", height: "37px", background: "black"}} /> :
            <ImageTabs
              activeTab={activeTab}
              changeActiveTab={
                newActiveTab => this.changeActiveTab(newActiveTab)
              }
            />
          }
          <div style={toolsStyle} >
            <StageButton
              action={relevantAction}
              actionCall={
                activeTab === 'source' ? () => this.changeActiveTab('select') :
                this[relevantAction]
              }
              key="Main StageButton"
            />
            {activeTab === 'select' ?
              ( this.state.sourceImageProvided ?
                <StageButton
                action="cancel"
                actionCall={() => this.changeActiveTab('source')}
                key="Cancel"
              /> : '' ) : [
              <span style={{marginTop: "6px"}} key="File Name" >
                {sourceImageInfo ? sourceImageInfo.name
                  : "No Source Image Selected"}
              </span>,
              <MagnificationInput
                mag={mags[activeTab]}
                changeMag={newMag => this.changeMag(activeTab, newMag)}
                key="Magnification"
              /> ]
            }
          </div>
          {activeTab === 'select' ?
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{display: "none"}}
              onChange={(e) => this.handleFile(e)}
            /> : ''
          }
        </div>
        <div ref={this.containerRef} style={containerStyle} >
          {canvases}
        </div>
      </Fragment>
    );
  }
}