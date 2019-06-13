import { func, number } from "prop-types";
import React, { Component, createRef } from "react";
import styled from "styled-components";

import Playhead from "./of/Playhead";

const TPWrapper = styled.div`
  height: 28px;
  position: relative;
  user-select: none;
  width: 100%;
  z-index: 9999;
`;

class TimelineWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateRef = this.updateRef.bind(this);
    this.wrapperRef = createRef();
  }

  componentDidMount() {
    this.updateRef();
    window.addEventListener("resize", this.updateRef.bind(this));
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.updateRef.bind(this));
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
    return (
      <TPWrapper ref={this.wrapperRef}>
        <Playhead
          currentTime={this.props.currentTime}
          duration={this.props.duration}
          setCurrentTime={this.props.setCurrentTime}
          wrapper={this.state.wrapper}
        />
      </TPWrapper>
    );
  }
}

export default TimelineWrapper;

TimelineWrapper.propTypes = {
  currentTime: number.isRequired,
  duration: number.isRequired,
  setCurrentTime: func.isRequired
};
TimelineWrapper.defaultProps = {};
