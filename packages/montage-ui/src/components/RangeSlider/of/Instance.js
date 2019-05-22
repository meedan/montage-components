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

class Instance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overInstance: null,
      dragging: null,
      overHandle: null
    };
    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.onHandleDragEnd = this.onHandleDragEnd.bind(this);
    this.onHandleDragStart = this.onHandleDragStart.bind(this);
    this.updateEdge = this.updateEdge.bind(this);
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
      overInstance: true,
      dragging: edge
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
        overHandle: edge,
        overInstance: true
      },
      () => this.updateEdge(edge)
    );
  }

  onHandleDragEnd(e, edge) {
    this.setState(
      {
        dragging: null,
        overHandle: null,
        overInstance: null
      },
      () => this.updateEdge(edge)
    );
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

    const handles = [
      {
        edge: "end",
        value: this.state.end
      },
      {
        edge: "start",
        value: this.state.start
      }
    ];

    return (
      <RSInstance
        style={{
          left: `${x1}px`,
          right: `${x2}px`,
          zIndex: this.state.overInstance ? `1000` : `default`
        }}
        onMouseEnter={() => this.setState({ overInstance: true })}
        onMouseLeave={() => this.setState({ overInstance: null })}
      >
        {handles.map(handle => {
          const { value, edge } = handle;
          return (
            <RSHandle
              draggable
              isVisible={
                this.state.overInstance || this.state.dragging === edge
              }
              key={edge}
              onDrag={e => this.onHandleDrag(e, edge)}
              onDragEnd={e => this.onHandleDragEnd(e, edge)}
              onDragStart={e => this.onHandleDragStart(e, edge)}
              onMouseEnter={() => this.setState({ overHandle: edge })}
              onMouseLeave={() => this.setState({ overHandle: null })}
              pos={edge}
            >
              <MeTooltip
                isVisible={
                  this.state.overHandle === edge || this.state.dragging === edge
                }
              >
                {formatSeconds(value)}
              </MeTooltip>
            </RSHandle>
          );
        })}
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
