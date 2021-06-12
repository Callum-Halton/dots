import Logo from './Logo.js';

const titleBarStyle = {
  backgroundColor: "black",
  marginBottom: "2px",
  width: "calc(100% - 10px)",
  height: "40px",
  padding: "10px",
  paddingRight: "0px",
}

export default function TitleBar() {
  return (
    //w={375} h={175} r={50} lw={25} s={25}
    <div style={titleBarStyle}>
      <Logo w={86} h={40} r={11.4} lw={5.7} s={5.7} c="rgb(255, 255, 255)" bc="rgb(0, 0, 0)"/>
    </div>
  );
}