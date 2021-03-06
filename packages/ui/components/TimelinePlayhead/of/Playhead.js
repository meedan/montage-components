import { bool, func, number, object, shape } from 'prop-types';
import React, { Component, createRef } from 'react';
import styled from 'styled-components';

import { MeTooltip, formatSeconds } from '@montage/ui';
import { color } from '@montage/ui/config/';

const El = styled.div`
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
    content: ' ';
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
    content: ' ';
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
    this.state = { time: 0 };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  static getDerivedStateFromProps({ time }) {
    return { time };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(e) {
    if (!e) return null;
    const coords = { x: e.pageX, y: e.pageY };

    const { duration, rect } = this.props;
    const { width, left } = rect;

    if (coords.x <= 0) return null;
    const newTime = ((coords.x - left) * duration) / width;

    this.setState(prevState => ({
      dragging: true,
      newTime: newTime >= 0 && newTime <= duration ? newTime : prevState.time,
    }));
    return null;
  }

  onMouseMove(e) {
    if (!e) return null;
    const coords = { x: e.pageX, y: e.pageY };

    if (!this.state.dragging) return null;
    const { duration, rect } = this.props;
    const { width, left } = rect;

    if (coords.x <= 0) return null;
    const newTime = ((coords.x - left) * duration) / width;

    this.setState(
      prevState => ({
        newTime:
          newTime >= 0 && newTime <= duration ? newTime : prevState.newTime,
      }),
      this.props.updateTime(this.state.newTime)
    );

    return null;
  }

  onMouseUp() {
    this.setState({ dragging: false });
  }

  render() {
    if (!this.props.rect) return null;

    const { duration, rect } = this.props;
    const { dragging, time, newTime } = this.state;
    const { width } = rect;

    const displayTime = dragging ? newTime : time;

    const x = (displayTime * width) / duration;

    return (
      <El
        style={{
          left: `${x}px`,
        }}
        onMouseDown={this.onMouseDown}
      >
        <MeTooltip isVisible={dragging}>{formatSeconds(displayTime)}</MeTooltip>
      </El>
    );
  }
}

export default Playhead;

Playhead.propTypes = {
  duration: number.isRequired,
  rect: object,
  time: number.isRequired,
  updateTime: func.isRequired,
};
Playhead.defaultProps = {
  rect: null,
};
