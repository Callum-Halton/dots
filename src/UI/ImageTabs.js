import './ImageTabs.css';

const tabTypeNames = {
  source: "Source Image",
  art: "Pointillist Rendering"
}

export default function ImageTabs(props) {

  let imageTabs = [];
  for (let tabType in tabTypeNames) {
    let classes = "imageTab";
    if (tabType !== props.activeTab) {
      classes += " nonActive";
    }
    imageTabs.push(
      <button
        className={classes}
        onClick={() => props.changeActiveTab(tabType)}
        key={tabType}
      >
        {tabTypeNames[tabType]}
      </button>
    );
  }
  return <div>{imageTabs}</div>;
}