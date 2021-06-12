// REMEMBER: remove app.css from imports if never used
import './App.css';
import React, { Component } from 'react';
import OptionsPanel from './OptionsPanel.js';
import Stage from './Stage.js';
import TitleBar from './TitleBar.js';
import { SourceImage,
         SampleOptions } from '../Processing/samplePrepClasses.js'
import getSample from '../Processing/getSample.js'

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
    this.canvasRefs = {
      source: null,
      art: null,
    }
    this.sourceImage = null;

    this.state = {
      sourceImageInfo: null,
      openOptionPanel: null,
      options: {
        sample: {
          sampleLimit: new Option(
            20, 'Sample Limit',
            new IntOptionInfo(true, 1, 50)
          ),
          maxExclRadius: new Option(
            24, 'Exclusion Radius',
            new IntOptionInfo(20, 1, 40, false, 'minExclRadius'),
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
    this.changeSourceImage = this.changeSourceImage.bind(this);
    this.changeOptionVal = this.changeOptionVal.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.sampleNow = this.sampleNow.bind(this);
    this.renderNow = this.renderNow.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
    //this.download = this.download.bind(this);

  }

  setCanvasRef(tabType, ref) {
    this.canvasRefs[tabType] = ref;
  }

  changeSourceImage(newSourceImage) {
    let srcCanvas = this.canvasRefs.source;
    var ctx = srcCanvas.getContext('2d');
    var img = new Image();
    img.src = URL.createObjectURL(newSourceImage);
    img.onload = () => {
      let { width, height } = img;
      this.setState({
        sourceImageInfo: new SourceImageInfo(newSourceImage.name, width, height)
      });
      srcCanvas.width = width;
      srcCanvas.height = height;
      ctx.drawImage(img, 0, 0);

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
    }
  }

  sampleNow() {
    this.setState(prevState => {
      let { options } = prevState;
      let varyDotDensity = options.sample.varyDotDensity.val;
      return({
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

    let sample = getSample(
      this.sourceImage,
      new SampleOptions(this.state.options.sample)
    );
    //this.togglePanel('render');

  }

  renderNow() {
    console.log('render');
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
          disableActionButton={state.sourceImageInfo ? false : true}
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