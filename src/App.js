import './App.css';
import React, { Component, Fragment } from 'react';
import OptionsPanel from './OptionsPanel.js';
import Stage from './Stage.js';

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
      hideWhenGrey, greyedPrefix) {
    this.val = val;
    this.name = name;
    this.intOptionInfo = intOptionInfo || null;
    this.dependencyKey = dependencyKey || null;
    this.dependencyValToGrey = dependencyValToGrey;
    this.hideWhenGrey = hideWhenGrey || false;
    this.greyedPrefix = greyedPrefix || '';
  }
}

const titleBarStyle = {
  backgroundColor: "black",
  marginBottom: "2px",
  width: "100%",
  height: "50px",
  flex: "0 0 auto",
}

function TitleBar() {
  return (
    <div style={titleBarStyle} />
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleOfOpenPanel: 'Sampling',
      options: {
        sample: {
          sampleLimit: new Option(20, 'Sample Limit',
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
            true, 'White Dots On Black Background', null, 'varyDotDensity',
            false, true
          ),
        },
        render: {
          whiteDotsOnBlackBackground: new Option(
            false, 'White Dots On Black Background', null, 'varyDotDensity',
            true, false
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
            1000, 'Total Number of Dots to Draw', new IntOptionInfo(false, 0),
            'drawSpecificNumOfDots', false, true
          ),
        }
      }
    }
    this.changeOptionVal = this.changeOptionVal.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
  }

  changeOptionVal(optionKey, newVal) {
    let { options } = this.state;
    let relevantOptionGroupKeys = [];
    for (let optionGroupKey in options) {
      if (optionKey in options[optionGroupKey]) {
        relevantOptionGroupKeys.push(optionGroupKey);
      }
    }

    let relevantOptionGroup = options[relevantOptionGroupKeys[0]]
    let intOptionInfo = relevantOptionGroup[optionKey].intOptionInfo;
    if (intOptionInfo) {
      if (!Number.isInteger(newVal) || newVal < intOptionInfo.min ||
          (intOptionInfo.strictMax && newVal > intOptionInfo.max) ||
          (intOptionInfo.minDependency
          && newVal < relevantOptionGroup[intOptionInfo.minDependency].val) ||
          (intOptionInfo.maxDependency
          && newVal > relevantOptionGroup[intOptionInfo.maxDependency].val)) {
        return;
      }
    }

    for (let relevantOptionGroupKey of relevantOptionGroupKeys) {
      this.setState(prevState => ({
          ...prevState,
          options: {
              ...prevState.options,
              [relevantOptionGroupKey]: {
                  ...prevState.options[relevantOptionGroupKey],
                  [optionKey]: {
                     ...prevState.options[relevantOptionGroupKey][optionKey],
                     val: newVal
                  }
              }
          }
      }));
    }

    // dirty hack
    if (newVal === false) {
      if (optionKey === 'varyDotDensity') {
        this.changeOptionVal('minExclRadius', 1);
      } else if (optionKey === 'varyDotDiameter') {
        this.changeOptionVal('minDotDiameter', 0)
      }
    }
  }

  togglePanel(title) {
    this.setState(prevState => ({
        ...prevState,
        titleOfOpenPanel: prevState.titleOfOpenPanel === title ? null : title
    }));
  }

  render () {
    let { titleOfOpenPanel, options } = this.state
    return (
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          height: "100vh",
        }}
      >
        <TitleBar/>
        <OptionsPanel
          relevantOptions={options.sample}
          changeOptionVal={this.changeOptionVal}
          title="Sampling"
          open={titleOfOpenPanel === "Sampling"}
          togglePanel={this.togglePanel}
          extraDependencies={{}}
          top={true}
        />
        <Stage
          blackBackground={options.sample.whiteDotsOnBlackBackground.val}
        />
        <OptionsPanel
          relevantOptions={options.render}
          changeOptionVal={this.changeOptionVal}
          title="Rendering"
          open={titleOfOpenPanel === "Rendering"}
          togglePanel={this.togglePanel}
          extraDependencies={{varyDotDensity: options.sample.varyDotDensity}}
          top={false}
        />
      </div>
    );
  }
}

