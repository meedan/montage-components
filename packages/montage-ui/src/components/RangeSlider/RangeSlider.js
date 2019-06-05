import React, { Component, createRef } from "react";
import { array, func, number } from "prop-types";
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
    this.updateRef = this.updateRef.bind(this);
    this.wrapperRef = createRef();
  }

  static getDerivedStateFromProps(props, state) {
    return { ...state, instances: props.instances };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateRef.bind(this));
    this.updateRef();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateRef.bind(this));
  }

  updateRef() {
    if (!this.wrapperRef) return null;
    this.setState({
      wrapper: {
        ref: this.wrapperRef.current,
        rect: this.wrapperRef.current.getBoundingClientRect()
      }
    });
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
              deleteInstance={this.props.deleteInstance}
              duration={duration}
              end={end_seconds}
              extendInstance={this.props.extendInstance}
              id={id}
              instancePopoverChildren={instancePopoverChildren}
              instances={instances}
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
  deleteInstance: func.isRequired,
  duration: number.isRequired,
  extendInstance: func.isRequired,
  instances: array.isRequired
};
RangeSlider.defaultProps = {};
