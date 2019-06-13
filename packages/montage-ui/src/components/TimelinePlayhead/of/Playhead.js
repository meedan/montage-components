import { bool, func, number, object, shape } from "prop-types";
import React, { Component, createRef } from "react";
import styled from "styled-components";

import { MeTooltip, formatSeconds } from "@montage/ui";
import { color } from "@montage/ui/src/config/";

const El = styled.div`
  background: rgba(0, 0, 0, 0.1);
  cursor: -webkit-grab;
  cursor: col-resize;
  cursor: grab;
  height: 100%;
  pointer-events: all;
  position: absolute;
  touch-action: pan-x;
  transform: translateX(-50%);
  width: 7px;
  &:before {
    background: ${color.brand};
    border-radius: 4px;
    content: " ";
    display: block;
    height: 7px;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translate(-55%, -50%);
    width: 7px;
  }
  &:after {
    border-left: 1px solid ${color.brand};
    content: " ";
    display: block;
    height: 100%;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    width: 1px;
  }
`;

class Playhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null
    };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.updateRef = this.updateRef.bind(this);
    this.wrapperRef = createRef();
  }

  componentDidMount() {
    this.setState({
      time: this.props.time
    });
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.updateRef();
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    if (!e) return null;
    const coords = { x: e.pageX, y: e.pageY };

    const { duration, wrapper } = this.props;
    const { width, left } = wrapper.rect;

    if (coords.x <= 0) return null;
    const newTime = ((coords.x - left) * duration) / width;

    this.props.onBeforeChange(newTime);
    return null;
  }

  onMouseMove(e) {
    if (!e) return null;
    const coords = { x: e.pageX, y: e.pageY };

    if (!this.props.dragging) return null;
    const { duration, wrapper } = this.props;
    const { width, left } = wrapper.rect;

    if (coords.x <= 0) return null;
    const newTime = ((coords.x - left) * duration) / width;

    this.setState(
      prevState => ({
        time: newTime >= 0 && newTime <= duration ? newTime : prevState.time
      }),
      this.props.onChange(this.state.time)
    );

    return null;
  }

  onMouseUp() {
    this.props.onAfterChange();
  }

  updateRef() {
    if (!this.wrapperRef) return null;
    if (!this.wrapperRef.current) return null;
    this.setState({
      wrapper: {
        ref: this.wrapperRef.current,
        rect: this.wrapperRef.current.getBoundingClientRect()
      }
    });
    return null;
  }

  render() {
    if (!this.props.wrapper) return null;
    if (!this.props.wrapper.ref) return null;

    const { dragging, duration, wrapper } = this.props;
    const { time } = this.state;
    const { width } = wrapper.rect;

    const x = (time * width) / duration;

    return (
      <El
        style={{
          left: `${x}px`
        }}
        onMouseDown={this.onMouseDown}
      >
        <MeTooltip isVisible={dragging}>{formatSeconds(time)}</MeTooltip>
      </El>
    );
  }
}

export default Playhead;

Playhead.propTypes = {
  duration: number.isRequired,
  dragging: bool,
  onAfterChange: func.isRequired,
  onBeforeChange: func.isRequired,
  onChange: func.isRequired,
  time: number.isRequired,
  wrapper: shape({
    rect: object.isRequired,
    ref: object.isRequired
  })
};
Playhead.defaultProps = {
  dragging: null,
  wrapper: null
};
