import { func, number, object } from "prop-types";
import React, { Component, createRef } from "react";
import styled from "styled-components";

import Playhead from "./of/Playhead";

const PlayheadTrack = styled.div`
  min-height: 28px;
  overflow: visible;
  pointer-events: none;
  position: relative;
  user-select: none;
  width: 100%;
`;

class TimelineWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
    this.updateTime = this.updateTime.bind(this);
    this.measureRef = this.measureRef.bind(this);
    this.ref = createRef();
  }

  static getDerivedStateFromProps({ time }) {
    return { time };
  }

  componentDidMount() {
    this.measureRef();
    window.addEventListener("resize", this.measureRef.bind(this));
    document.addEventListener("resize", this.measureRef.bind(this));
  }

  componentWillUnmount() {
    document.addEventListener("resize", this.measureRef.bind(this));
    window.addEventListener("resize", this.measureRef.bind(this));
  }

  measureRef() {
    if (this.ref && this.ref.current)
      this.setState({ rect: this.ref.current.getBoundingClientRect() });
  }

  updateTime(time) {
    this.setState({ time }, () => this.props.onTimeChange(time));
  }

  render() {
    const { rect, time } = this.state;

    return (
      <PlayheadTrack ref={this.ref} style={this.props.style}>
        <Playhead
          duration={this.props.duration}
          rect={rect}
          time={time}
          updateTime={this.updateTime}
        />
      </PlayheadTrack>
    );
  }
}

export default TimelineWrapper;

TimelineWrapper.propTypes = {
  duration: number.isRequired,
  onTimeChange: func.isRequired,
  style: object,
  time: number
};
TimelineWrapper.defaultProps = {
  style: null,
  time: 0
};
