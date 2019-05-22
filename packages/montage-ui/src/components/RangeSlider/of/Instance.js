import { number, shape, object } from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";

import { MeTooltip, formatSeconds } from "@montage/ui";

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
  transform: ${({ isVisible, pos }) =>
    isVisible ? `translateX(${pos === "start" ? `-2px` : `2px`})` : `none`};
  transition: transform 250ms, opacity 250ms;
  width: 4px;
  z-index: 1;
`;

// const calcVal = (edge, start, end, duration, coords, rect) => {
//   if (coords.x <= 0) return null;
//   const { width, left } = rect;
//   const newTime = ((coords.x - left) * duration) / width;
//
//   if (edge === "start" && newTime > end) {
//     return end - 5 < 0 ? 0 : end - 5;
//   }
//   if (edge === "end" && newTime < start) {
//     return start + 5 > duration ? duration : start + 5;
//   }
//   return newTime;
// };

class Instance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHoveringInstance: null,
      isDraggingHandle: null,
      isHoveringHandle: null
    };
    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.onHandleDragEnd = this.onHandleDragEnd.bind(this);
    this.onHandleDragStart = this.onHandleDragStart.bind(this);
    this.onHandleEnter = this.onHandleEnter.bind(this);
    this.updateEdge = this.updateEdge.bind(this);
    this.onHandleLeave = this.onHandleLeave.bind(this);
    this.onInstanceEnter = this.onInstanceEnter.bind(this);
    this.onInstanceLeave = this.onInstanceLeave.bind(this);
  }

  componentDidMount() {
    this.setState({
      end: this.props.end,
      start: this.props.start
    });
    return null;
  }

  onHandleDragStart(e, edge) {
    this.setState({
      isHoveringInstance: true,
      isDraggingHandle: edge
    });
    const img = document.createElement("img");
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAABGdBTUEAALGPC/xhBQAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC";
    e.dataTransfer.setData("text/plain", "foo");
    e.dataTransfer.setDragImage(img, 0, 0);
  }

  onHandleDrag(e, edge) {
    this.setState(
      {
        isHoveringHandle: edge,
        isHoveringInstance: true
      },
      () => this.updateEdge(edge)
    );
  }

  onHandleDragEnd(e, edge) {
    this.setState(
      {
        isDraggingHandle: null,
        isHoveringHandle: null,
        isHoveringInstance: null
      },
      () => this.updateEdge(edge)
    );
  }

  onInstanceEnter() {
    this.setState({ isHoveringInstance: true });
  }

  onInstanceLeave() {
    this.setState({ isHoveringInstance: null });
  }

  onHandleEnter(edge) {
    this.setState({ isHoveringHandle: edge });
  }

  onHandleLeave() {
    this.setState({ isHoveringHandle: null });
  }

  updateEdge(edge) {
    const { coords, duration, wrapper } = this.props;
    const { width, left } = wrapper.rect;
    const { end, start } = this.state;
    const minLength = (6 * duration) / width;

    if (coords.x <= 0) return null;
    let newTime = ((coords.x - left) * duration) / width;

    if (edge === "start" && newTime > end - minLength) {
      newTime = end - minLength < 0 ? 0 : end - minLength;
    }
    if (edge === "end" && newTime < start + minLength) {
      newTime = start + minLength > duration ? duration : start + minLength;
    }

    this.setState(prevState => ({
      [edge]: newTime > 0 && newTime < duration ? newTime : prevState[edge]
    }));

    return null;
  }

  render() {
    if (!this.props.wrapper) return null;
    if (!this.props.wrapper.ref) return null;

    const { duration, wrapper } = this.props;
    const { width } = wrapper.rect;

    const x1 = (this.state.start * width) / duration;
    const x2 = width - (this.state.end * width) / duration;

    return (
      <RSInstance
        style={{
          left: `${x1}px`,
          right: `${x2}px`,
          zIndex: this.state.isHoveringInstance ? `1000` : `default`
        }}
        onMouseEnter={this.onInstanceEnter}
        onMouseLeave={this.onInstanceLeave}
      >
        <RSHandle
          draggable
          isVisible={
            this.state.isHoveringInstance ||
            this.state.isDraggingHandle === "start"
          }
          onDrag={e => this.onHandleDrag(e, "start")}
          onDragEnd={e => this.onHandleDragEnd(e, "start")}
          onDragStart={e => this.onHandleDragStart(e, "start")}
          onMouseEnter={() => this.onHandleEnter("start")}
          onMouseLeave={this.onHandleLeave}
          pos="start"
        >
          <MeTooltip
            isVisible={
              this.state.isHoveringHandle === "start" ||
              this.state.isDraggingHandle === "start"
            }
          >
            {formatSeconds(this.state.start)}
          </MeTooltip>
        </RSHandle>
        <RSHandle
          draggable
          isVisible={
            this.state.isHoveringInstance ||
            this.state.isDraggingHandle === "end"
          }
          onDrag={e => this.onHandleDrag(e, "end")}
          onDragEnd={e => this.onHandleDragEnd(e, "end")}
          onDragStart={e => this.onHandleDragStart(e, "end")}
          onMouseEnter={() => this.onHandleEnter("end")}
          onMouseLeave={this.onHandleLeave}
          pos="end"
        >
          <MeTooltip
            isVisible={
              this.state.isHoveringHandle === "end" ||
              this.state.isDraggingHandle === "end"
            }
          >
            {formatSeconds(this.state.end)}
          </MeTooltip>
        </RSHandle>
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
