// REMEMBER: remove app.css from imports if never used
import './App.css';
import React, { Component } from 'react';
import OptionsPanel from './OptionsPanel.js';
import Stage from './Stage.js';
import TitleBar from './TitleBar.js';
import { SourceImage,
         SampleOptions,
         RenderOptions } from '../Processing/samplePrepClasses.js';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Processor from 'workerize-loader!../Processing/processor.js';

function ProcessState() {
  this.progress = null; // 'started'/'completed'
  this.size = 0;
}

class IntOptionInfo {
  constructor(showSlider, min, max, strictMax, minDependency, maxDependency) {
    this.showSlider = showSlider;
    this.min = min;
    this.max = max || null;
    this.strictMax = strictMax || false;
    this.minDependency = minDependency || null;
    this.maxDependency = maxDependency || null;
  }
}

class Option {
  constructor(val, name, intOptionInfo, dependencyKey, dependencyValToGrey,
      hideWhenGrey, greyedPrefix, disabled) {
    this.val = val;
    this.name = name;
    this.intOptionInfo = intOptionInfo || null;
    this.dependencyKey = dependencyKey || null;
    this.dependencyValToGrey = dependencyValToGrey;
    this.hideWhenGrey = hideWhenGrey || false;
    this.greyedPrefix = greyedPrefix || '';
    this.disabled = false;
  }
}

class SourceImageInfo {
  constructor(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRefs = { /*source: null, art: null*/ };
    this.validRenderID = 0;
    this.state = {
      activeTab: 'select',
      openOptionPanel: null,

      sourceImageInfo: null,
      processStates: {
        sample: new ProcessState(),
        render: new ProcessState(),
      },

      options: {
        sample: {
          sampleLimit: new Option(
            20, 'Sample Limit',
            new IntOptionInfo(true, 1, 50)
          ),
          maxExclRadius: new Option(
            24, 'Exclusion Radius',
            new IntOptionInfo(20, 2, 40, false, 'minExclRadius'),
            'varyDotDensity', false, false, 'Max '
          ),
          varyDotDensity: new Option(true, 'Vary Dot Density'),
          minExclRadius: new Option(
            6, 'Min Exclusion Radius',
            new IntOptionInfo(true, 1, 20, false, null, 'maxExclRadius'),
            'varyDotDensity', false, true
          ),
          whiteDotsOnBlackBackground: new Option(
            true, 'White Dots On Black Background', null,
            'varyDotDensity', false, true
          ),
        },
        render: {
          whiteDotsOnBlackBackground: new Option(
            false, 'White Dots On Black Background'
          ),
          varyDotBrightness: new Option(true, 'Vary Dot Brightness'),
          maxDotDiameter: new Option(
            6, 'Dot Diameter',
            new IntOptionInfo(5, 0, 30, false, 'minDotDiameter'),
            'varyDotDiameter', false, false, 'Max '
          ),
          varyDotDiameter: new Option(true, 'Vary Dot Diameter'),
          minDotDiameter: new Option(
            3, 'Min Dot Diameter',
            new IntOptionInfo(true, 0, 20, false, null, 'maxDotDiameter'),
            'varyDotDiameter', false, true
          ),
          minLDiffTwixDotnBackgroundToDraw: new Option(
            5, 'Minimum Difference in Intensity from Background to Draw',
            new IntOptionInfo(true, 0, 256, true),
            'drawSpecificNumOfDots', true, false
          ),
          drawSpecificNumOfDots: new Option(
            false, 'Draw Specific Number of Dots'
          ),
          totDotsToDraw: new Option(
            1000, 'Total Number of Dots to Draw',
            new IntOptionInfo(false, 0),
            'drawSpecificNumOfDots', false, true
          ),
        }
      }
    }

    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.changeSourceImage = this.changeSourceImage.bind(this);
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.changeOptionVal = this.changeOptionVal.bind(this);
    this.sampleNow = this.sampleNow.bind(this);
    this.renderNow = this.renderNow.bind(this);
    //this.download = this.download.bind(this);

  }

  updateProcessStateVal(processKey, stateKeyToChange, newVal) {
    this.setState( prevState => ({
      ...prevState,
      processStates: {
        ...prevState.processStates,
        [processKey]: {
          ...prevState.processStates[processKey],
          [stateKeyToChange]: newVal
        }
      }
    }));
    if (stateKeyToChange === 'sample'
        && this.state.processStates[processKey].progress !== 'started') {
      this.updateProcessStateVal(processKey, 'progress', 'started');
    }
  }

  componentDidMount() {
    this.initiateProcessor();
  }

  initiateProcessor() {
    if (window.Worker) {
      this.processor = Processor();
      this.processor.onmessage = (e) => {
        let { data } = e;
        switch(data.type) {
          case 'sampleSize':
            this.updateProcessStateVal('sample', 'size', data.size);
            /*if (data.isCompleted && this.state.openOptionPanel !== 'render') {
              this.togglePanel('render');
            }*/
            break;

          case 'completionMsg':
            this.updateProcessStateVal(data.processKey, 'progress', 'completed');
            if (data.processKey === 'sample') {
              if (this.state.openOptionPanel !== 'render') {
                this.togglePanel('render');
              }
            } else {
              this.updateProcessStateVal('render', 'size', this.dotsRenderedPrecise);
            }
            break;

          case 'dotInfo':
            if (data.renderID === this.validRenderID) {
              if (data.drawDot) {
                let { x, y, r, l } = data;
                this.dotsRenderedPrecise++;
                let t1 = performance.now();
                // 30fps
                if (t1 - this.t0 >= 100/3) {
                  this.updateProcessStateVal('render', 'size', this.dotsRenderedPrecise);
                  this.t0 = t1;
                }
                let ctx = this.canvasRefs.art.getContext('2d');
                ctx.fillStyle = this.getColorFromIntensity(l);
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.fill();
              }
              this.processor.postMessage({ command: 'getDotInfo' });
            } else {
              console.log(data.renderID, this.validRenderID)
            }
            break;

          default:
            console.log('Processor Initiated');
        }
      }
    } else {
      // replace with screen blocker
      alert("Your browser doesn't support the required Web Worker API, try updating or switching browsers.");
    }
  }

  setCanvasRef(tabType, ref) {
    this.canvasRefs[tabType] = ref;
  }

  changeSourceImage(newSourceImage) {
    let { canvasRefs } = this;
    let srcCanvas = canvasRefs.source;
    let artCanvas = canvasRefs.art;
    let ctx = srcCanvas.getContext('2d');
    let img = new Image();
    img.src = URL.createObjectURL(newSourceImage);
    img.onload = () => {
      let { width, height } = img;
      srcCanvas.width = artCanvas.width = width;
      srcCanvas.height = artCanvas.height = height;
      ctx.drawImage(img, 0, 0);
      this.setState({
        sourceImageInfo: new SourceImageInfo(newSourceImage.name, width, height)
      });

      let imgData = ctx.getImageData(0, 0, width, height);
      let pixels = imgData.data;
      let condensedPixels = [];
      for (let i = 0; i < pixels.length; i += 4) {
        let l = 0.34 * pixels[i] + 0.5 * pixels[i + 1]
          + 0.16 * pixels[i + 2];
        pixels[i] = l;
        pixels[i + 1] = l;
        pixels[i + 2] = l;
        condensedPixels.push(l);
      }

      ctx.putImageData(imgData, 0, 0);
      this.sourceImage = new SourceImage(condensedPixels, width, height);

      if (this.state.openOptionPanel !== 'sample') {
        this.togglePanel('sample');
      }
      this.changeActiveTab('source');
    }
  }

  sampleNow() {
    this.setState(prevState => {
      let { options } = prevState;
      let varyDotDensity = options.sample.varyDotDensity.val;
      return ({
        ...prevState,
        options: {
          ...options,
          render: {
            ...options.render,
            whiteDotsOnBlackBackground: {
              ...options.render.whiteDotsOnBlackBackground,
              val: varyDotDensity ?
                options.sample.whiteDotsOnBlackBackground.val :
                options.render.whiteDotsOnBlackBackground.val,
              disabled: varyDotDensity
            }
          }
        }
      });
    });

    let { processStates } = this.state;
    if (processStates.sample.progress === 'started') {
      this.processor.terminate();
      this.initiateProcessor();
    }
    if (processStates.render.progress) {
      this.validRenderID++;
      this.updateProcessStateVal('render', 'progress', null);
      this.updateProcessStateVal('render', 'size', 0);
      let artCanvas = this.canvasRefs.art;
      let ctx = artCanvas.getContext('2d');
      ctx.clearRect(0, 0, artCanvas.width, artCanvas.height);
    }
    this.processor.postMessage({
      command: 'sample',
      sourceImage: this.sourceImage,
      options: new SampleOptions(this.state.options.sample),
    });
    this.updateProcessStateVal('sample', 'progress', 'started');
  }

  renderNow() {
    this.validRenderID++;
    if (this.state.openOptionPanel === 'render') {
      this.togglePanel('render');
    }
    this.changeActiveTab('art');

    let renderOptions = new RenderOptions(this.state.options.render);
    let artCanvas = this.canvasRefs.art;
    let ctx = artCanvas.getContext('2d');
    ctx.fillStyle = this.getColorFromIntensity(
      renderOptions.backgroundIntensity);
    ctx.fillRect(0, 0, artCanvas.width, artCanvas.height);

    this.dotsRenderedPrecise = 0;
    this.updateProcessStateVal('render', 'progress', 'started');
    this.t0 = performance.now();
    this.processor.postMessage({
      command: 'prepRender', options: renderOptions, renderID: this.validRenderID
    });
  }

  getColorFromIntensity(l) {
    return `rgb(${l}, ${l}, ${l})`;
  }

/*
  download() {
    console.log('downloaded');
  }
*/
  changeOptionVal(optionGroupKey, optionKey, newVal) {
    let optionGroup = this.state.options[optionGroupKey]
    let intOptionInfo = optionGroup[optionKey].intOptionInfo;
    if (intOptionInfo) {
      if (!Number.isInteger(newVal) || newVal < intOptionInfo.min ||
          (intOptionInfo.strictMax && newVal > intOptionInfo.max) ||
          (intOptionInfo.minDependency
          && newVal < optionGroup[intOptionInfo.minDependency].val) ||
          (intOptionInfo.maxDependency
          && newVal > optionGroup[intOptionInfo.maxDependency].val)) {
        return;
      }
    }

    this.setState(prevState => ({
        ...prevState,
        options: {
            ...prevState.options,
            [optionGroupKey]: {
                ...prevState.options[optionGroupKey],
                [optionKey]: {
                   ...prevState.options[optionGroupKey][optionKey],
                   val: newVal
                }
            }
        }
    }));

    // dirty hack
    if (newVal === false) {
      if (optionKey === 'varyDotDensity') {
        this.changeOptionVal('sample', 'minExclRadius', 1);
      } else if (optionKey === 'varyDotDiameter') {
        this.changeOptionVal('render', 'minDotDiameter', 0)
      }
    }
  }

  changeActiveTab(newActiveTab) {
    this.setState({
      activeTab: newActiveTab,
    });
  }

  togglePanel(title) {
    this.setState(prevState => ({
      ...prevState,
      openOptionPanel: prevState.openOptionPanel === title ? null : title,
    }));
  }

  render () {
    let { state } = this;
    let { options } = state;
    let appElements = [<TitleBar key="TitleBar" />];
    for (let optionGroupKey in options) {
      appElements.push(
        <OptionsPanel
          processState={state.processStates[optionGroupKey]}
          disableActionButton={
            optionGroupKey === "sample" ? (state.sourceImageInfo ? false : true)
            : state.processStates.sample.progress !== 'completed'
          }
          optionGroupKey={optionGroupKey}
          actionCall={this[`${optionGroupKey}Now`]}
          relevantOptions={options[optionGroupKey]}
          changeOptionVal={this.changeOptionVal}
          open={state.openOptionPanel === optionGroupKey}
          togglePanel={this.togglePanel}
          top={optionGroupKey === "sample"}
          key={optionGroupKey}
        />
      );

      if (optionGroupKey === "sample") {
        appElements.push(
          <Stage
            processStates={this.state.processStates}
            changeActiveTab={this.changeActiveTab}
            activeTab={state.activeTab}
            setCanvasRef={this.setCanvasRef}
            sourceImageInfo={state.sourceImageInfo}
            changeSourceImage={this.changeSourceImage}
            key="Stage"
          />
        );
      }
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {appElements}
      </div>
    );
  }
}