import React, { Component, createRef } from "react";
import { array, number } from "prop-types";
import styled from "styled-components";

import Instance from "./of/Instance";

const RSWrapper = styled.div`
  height: 28px;
  position: relative;
  width: 100%;
`;

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: { x: 0, y: 0 },
      mouseX: 0
    };

    this.updateCoords = this.updateCoords.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    this.wrapperRef = createRef();
  }

  static getDerivedStateFromProps(props, state) {
    return { ...state, instances: props.instances };
  }

  componentDidMount() {
    document.addEventListener("dragover", this.updateCoords.bind(this));
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
    document.removeEventListener("dragover", this.updateCoords.bind(this));
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

  updateCoords(e) {
    if (!e) return null;
    this.setState({ coords: { x: e.pageX, y: e.pageY } });
    e.preventDefault();
    return null;
  }

  render() {
    const { duration } = this.props;
    const { coords, instances, wrapper } = this.state;

    return (
      <RSWrapper onDrop={e => e.preventDefault()} ref={this.wrapperRef}>
        {instances.map((instance, i) => {
          const { id, start_seconds, end_seconds } = instance;
          return (
            <Instance
              coords={coords}
              duration={duration}
              end={end_seconds}
              i={i}
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
