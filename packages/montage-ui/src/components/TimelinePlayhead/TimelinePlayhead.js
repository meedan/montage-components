import { func, number } from "prop-types";
import React, { Component, createRef } from "react";
import styled from "styled-components";

import Playhead from "./of/Playhead";

const TPWrapper = styled.div`
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
      currentTime: null,
      dragging: null,
      newTime: null
    };
    this.onAfterChange = this.onAfterChange.bind(this);
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateRef = this.updateRef.bind(this);
    this.wrapperRef = createRef();
  }

  static getDerivedStateFromProps({ currentTime }) {
    return { currentTime };
  }

  componentDidMount() {
    this.updateRef();
    window.addEventListener("resize", this.updateRef.bind(this));
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.updateRef.bind(this));
  }

  onChange(newTime) {
    this.setState({ newTime }, () => this.props.onChange(this.state.newTime));
  }

  onBeforeChange(newTime) {
    this.setState({ dragging: true, newTime }, () =>
      this.props.onChange(this.state.newTime)
    );
  }

  onAfterChange() {
    this.setState({ dragging: null }, () =>
      this.props.onChange(this.state.newTime)
    );
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
    const { dragging, newTime, currentTime, wrapper } = this.state;
    return (
      <TPWrapper ref={this.wrapperRef} {...this.props}>
        <Playhead
          dragging={dragging}
          duration={this.props.duration}
          onAfterChange={this.onAfterChange}
          onBeforeChange={this.onBeforeChange}
          onChange={this.onChange}
          time={dragging ? newTime : currentTime}
          wrapper={wrapper}
        />
      </TPWrapper>
    );
  }
}

export default TimelineWrapper;

TimelineWrapper.propTypes = {
  currentTime: number,
  duration: number.isRequired,
  onChange: func.isRequired
};
TimelineWrapper.defaultProps = {
  currentTime: 0
};
