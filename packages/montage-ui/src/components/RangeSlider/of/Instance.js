import { number, shape, object } from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";

const RSInstance = styled(({ ...props }) => <div {...props} />)`
  backface-visibility: visible;
  background: rgba(71, 123, 181, 0.4);
  bottom: 0;
  position: absolute;
  top: 0;
`;

const RSHandle = styled(({ pos, isVisible, ...props }) => <div {...props} />)`
  ${({ pos }) => (pos === "start" ? `left: -2px;` : `right: -2px;`)};
  background: rgba(71, 123, 181, 1);
  bottom: 0;
  cursor: ew-resize;
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  position: absolute;
  top: 0;
  transform: ${({ isVisible }) =>
    isVisible ? `scaleX(0.5), translateX(-50%)` : `none`};
  transition: transform 250ms, opacity 250ms;
  width: 4px;
  z-index: 1;
`;

class Instance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.onHandleDragEnd = this.onHandleDragEnd.bind(this);
    this.onHandleDragStart = this.onHandleDragStart.bind(this);
    this.onInstanceEnter = this.onInstanceEnter.bind(this);
    this.onInstanceLeave = this.onInstanceLeave.bind(this);
  }

  componentDidMount() {
    this.setState({
      start: this.props.start,
      end: this.props.end
    });
    return null;
  }

  onHandleDragStart(e, edge) {
    this.setState({ isHovering: true, isDragging: true });
    const img = document.createElement("img");
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setData("text/plain", "foo");
    e.dataTransfer.setDragImage(img, 0, 0);
  }

  onHandleDrag(e, edge) {
    const { duration, coords } = this.props;
    const { width, left } = this.props.wrapper.rect;
    const newVal = ((coords.x - left) * duration) / width;
    // console.log(e);
    // console.log(e);
    // console.log(this.props.mousePos.x);
    // console.log({ width });
    // console.log({ left });
    // console.log({ newVal });
    // console.groupEnd();
    this.setState({ [edge]: newVal, isHovering: true });
    e.preventDefault();
  }

  onHandleDragEnd(e, edge) {
    const { duration, coords } = this.props;
    const { width, left } = this.props.wrapper.rect;
    const newVal = ((coords.x - left) * duration) / width;
    this.setState({ [edge]: newVal, isHovering: false, isDragging: false });
    e.preventDefault();
  }

  onInstanceEnter() {
    this.setState({ isHovering: true });
  }

  onInstanceLeave() {
    this.setState({ isHovering: false });
  }

  render() {
    if (!this.props.wrapper) return null;
    if (!this.props.wrapper.ref) return null;

    const { duration, wrapper } = this.props;
    const { isHovering, isDragging, start, end } = this.state;

    const x1 = (start * wrapper.rect.width) / duration;
    const x2 = wrapper.rect.width - (end * wrapper.rect.width) / duration;

    return (
      <RSInstance
        style={{
          left: `${x1}px`,
          right: `${x2}px`
        }}
        onMouseEnter={this.onInstanceEnter}
        onMouseLeave={this.onInstanceLeave}
        x1={x1}
        x2={x2}
      >
        <RSHandle
          draggable
          isVisible={isHovering || isDragging}
          onDrag={e => this.onHandleDrag(e, "start")}
          onDragEnd={e => this.onHandleDragEnd(e, "start")}
          onDragStart={e => this.onHandleDragStart(e, "start")}
          pos="start"
        />
        <RSHandle
          draggable
          isVisible={isHovering || isDragging}
          onDrag={e => this.onHandleDrag(e, "end")}
          onDragEnd={e => this.onHandleDragEnd(e, "end")}
          onDragStart={e => this.onHandleDragStart(e, "end")}
          pos="end"
        />
      </RSInstance>
    );
  }
}

export default Instance;

Instance.propTypes = {
  coords: shape({ x: number.isRequired, y: number.isRequired }).isRequired,
  start: number.isRequired,
  end: number.isRequired,
  duration: number.isRequired,
  wrapper: shape({
    rect: object.isRequired,
    ref: object.isRequired
  })
};
Instance.defaultProps = {
  wrapper: null
};
