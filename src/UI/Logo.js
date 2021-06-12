import React from 'react';

export default class Logo extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  dot(ctx, x, y, r, c, sa, ea, counterclockwise) {
    if (sa === undefined) {
      sa = 0;
      ea = 2 * Math.PI;
    }

    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, sa, ea, counterclockwise);
    ctx.lineTo(x, y);
    ctx.fill();
  }

  disk(ctx, x, y, sa, ea, counterclockwise) {
    let { r, lw, c, bc } = this.props;
    this.dot(ctx, x, y, r, c, sa, ea, counterclockwise);
    this.dot(ctx, x, y, r - lw, bc);
  }

  line(ctx, cx, cy, xShiftDir) {
    let { r, lw, c} = this.props;
    ctx.fillStyle = c;
    ctx.fillRect(cx - (lw / 2) + (xShiftDir * 1.5 * lw), cy - (2.5 * r), lw, 2.5 * r);
  }


  draw() {
    let { w, h, r, lw, s, c, bc } = this.props;
    let ctx = this.canvasRef.current.getContext('2d');
    ctx.fillStyle = bc;
    ctx.fillRect(0, 0, w, h);

    let cy = (2.5 * r);
    let cx = r;
    this.disk(ctx, cx, cy);
    this.line(ctx, cx, cy, 1);
    cx += (2 * r) + s - lw;
    this.dot(ctx, cx, cy, r - lw, c)
    cx += (2 * r) + s - lw;
    this.disk(ctx, cx, cy, Math.PI * 0.5, Math.PI * 1.5);
    this.line(ctx, cx, cy, -1);
    cx += (2 * r) - lw;
    this.disk(ctx, cx, cy, Math.PI, Math.PI * -0.5, true);
    this.disk(ctx, cx + 1, cy - r - lw, Math.PI * 0.5, Math.PI * 2);
  }

  componentDidMount() { this.draw(); }

  componentDidUpdate() { this.draw(); }

  render() {
    let { w, h } = this.props;
    return <canvas ref={this.canvasRef} width={w} height={h} />;
  }
}