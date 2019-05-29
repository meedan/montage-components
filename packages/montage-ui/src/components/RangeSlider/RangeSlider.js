import React, { Component, createRef } from "react";
import { array, number } from "prop-types";
import styled from "styled-components";

import Instance from "./of/Instance";

const RSWrapper = styled.div`
  height: 28px;
  position: relative;
  width: 100%;
  user-select: none;
`;

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.updateDimensions = this.updateDimensions.bind(this);

    this.wrapperRef = createRef();
  }

  static getDerivedStateFromProps(props, state) {
    return { ...state, instances: props.instances };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.setState(prevState => ({
      wrapper: {
        ...prevState.wrapper,
        ref: this.wrapperRef.current
      }
    }));
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    if (!this.wrapperRef) return null;
    const wrapperRect = this.wrapperRef.current.getBoundingClientRect();
    this.setState(prevState => ({
      wrapper: {
        ...prevState.wrapper,
        rect: wrapperRect
      }
    }));
    return null;
  }

  render() {
    const { duration, instancePopoverChildren } = this.props;
    const { instances, wrapper } = this.state;

    return (
      <RSWrapper ref={this.wrapperRef}>
        {instances.map((instance, i) => {
          const { id, start_seconds, end_seconds } = instance;
          return (
            <Instance
              duration={duration}
              end={end_seconds}
              i={i}
              instancePopoverChildren={instancePopoverChildren}
              key={id}
              start={start_seconds}
              wrapper={wrapper}
            />
          );
        })}
      </RSWrapper>
    );
  }
}

export default RangeSlider;

RangeSlider.propTypes = {
  instances: array.isRequired,
  duration: number.isRequired
};
RangeSlider.defaultProps = {};
