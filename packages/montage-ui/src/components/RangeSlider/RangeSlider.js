import { array, func, number } from "prop-types";
import React, { Component, createRef } from "react";
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
    this.state = {
      instances: []
    };
    this.deleteInstance = this.deleteInstance.bind(this);
    this.extendInstance = this.extendInstance.bind(this);
    this.updateInstance = this.updateInstance.bind(this);
    this.updateRef = this.updateRef.bind(this);
    this.wrapperRef = createRef();
  }

  componentWillMount() {
    this.setState({ instances: this.props.instances });
  }

  componentDidMount() {
    this.updateRef();
    window.addEventListener("resize", this.updateRef.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateRef.bind(this));
  }

  updateInstance(id, payload) {
    const i = this.state.instances.findIndex(i => i.id === id);
    const instances = [
      ...this.state.instances.slice(0, i),
      { ...this.state.instances[i], ...payload },
      ...this.state.instances.slice(i + 1)
    ];
    this.setState({ instances }, () => this.props.updateInstances(instances));
  }

  deleteInstance(id) {
    const { instances } = this.state;
    const i = instances.findIndex(instance => instance.id === id);
    instances.splice(i, 1);
    this.setState({ instances }, () => this.props.updateInstances(instances));
  }

  extendInstance(id) {
    const { instances } = this.state;
    const i = instances.findIndex(instance => instance.id === id);
    instances[i].start_seconds = 0;
    instances[i].end_seconds = this.props.duration;
    this.setState({ instances }, () => this.props.updateInstances(instances));
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
    const { duration } = this.props;
    const { instances, wrapper } = this.state;

    return (
      <RSWrapper ref={this.wrapperRef}>
        {instances.map(instance => {
          const { id, start_seconds, end_seconds } = instance;
          return (
            <Instance
              checkInstance={this.props.checkInstance}
              clipInstance={this.props.clipInstance}
              deleteInstance={() => this.deleteInstance(id)}
              duration={duration}
              end={end_seconds}
              extendInstance={() => this.extendInstance(id)}
              id={id}
              instance={instance}
              instances={instances}
              key={id}
              start={start_seconds}
              updateInstance={payload => this.updateInstance(id, payload)}
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
  checkInstance: func,
  clipInstance: func,
  duration: number.isRequired,
  instances: array.isRequired,
  updateInstances: func.isRequired
};
RangeSlider.defaultProps = {
  checkInstance: null,
  clipInstance: null
};
