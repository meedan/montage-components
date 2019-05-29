import { number, shape, object } from "prop-types";
import PopupState from "material-ui-popup-state";
import React, { Component } from "react";
import styled from "styled-components";

import { MeTooltip, formatSeconds } from "@montage/ui";

import HandlePopover from "./HandlePopover";
import InstancePopover from "./InstancePopover";

const RSInstance = styled(({ ...props }) => <div {...props} />)`
  backface-visibility: visible;
  background: rgba(71, 123, 181, 0.4);
  bottom: 0;
  position: absolute;
  top: 0;
`;

const RSHandle = styled(({ pos, isVisible, ...props }) => <div {...props} />)`
  background: rgba(71, 123, 181, 1);
  bottom: 0;
  cursor: ew-resize;
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  position: absolute;
  top: 0;
  transform: ${({ pos }) => `translateX(${pos === "start" ? `-50%` : `50%`})`};
  transition: transform 250ms, opacity 250ms;
  width: 4px;
  z-index: 2000;
  &:hover {
    opacity: 1 !important;
  }
`;

class Instance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: { x: 0, y: 0 },
      dragging: null,
      prevCoords: null
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.updateRef = this.updateRef.bind(this);

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);

    this.onHandleEnter = this.onHandleEnter.bind(this);
    this.onHandleLeave = this.onHandleLeave.bind(this);

    this.onInstanceEnter = this.onInstanceEnter.bind(this);
    this.onInstanceLeave = this.onInstanceLeave.bind(this);
  }

  componentDidMount() {
    this.setState({
      end: this.props.end,
      start: this.props.start
    });
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onInstanceEnter(e) {
    this.setState({ overInstance: true });
    this.updateRef(e.target);
  }

  onInstanceLeave(e, popupState) {
    this.setState({ overInstance: null });
  }

  onHandleEnter(e, edge) {
    this.setState({ overHandle: edge });
    this.updateRef(e.target);
  }

  onHandleLeave() {
    this.setState(prevState => ({
      overHandle: null,
      overInstance: prevState.overInstance ? prevState.overInstance : null
    }));
    this.updateRef(this.state.overInstance ? this.instanceRef.current : null);
  }

  onMouseDown(e, edge) {
    this.setState(prevState => ({
      dragging: edge,
      prevCoords: prevState.coords
    }));
  }

  onMouseUp() {
    if (!this.state.dragging) return null;
    this.setState({
      dragging: null,
      overInstance: null,
      overHandle: null,
      prevCoords: null
    });
    return null;
  }

  onMouseMove(e) {
    if (!e) return null;
    const coords = { x: e.pageX, y: e.pageY };
    this.setState({ coords });

    if (!this.state.dragging) return null;
    const { duration, wrapper } = this.props;
    const { dragging, end, start } = this.state;
    const { width, left } = wrapper.rect;
    const MIN_LENGTH = (6 * duration) / width;

    if (coords.x <= 0) return null;
    let newTime = ((coords.x - left) * duration) / width;

    if (dragging === "start" && newTime > end - MIN_LENGTH) {
      newTime = end - MIN_LENGTH < 0 ? 0 : end - MIN_LENGTH;
    }
    if (dragging === "end" && newTime < start + MIN_LENGTH) {
      newTime = start + MIN_LENGTH > duration ? duration : start + MIN_LENGTH;
    }

    this.updateRef(e.target);

    this.setState(prevState => ({
      coords,
      [dragging]:
        newTime > 0 && newTime < duration ? newTime : prevState[dragging]
    }));

    return null;
  }

  updateRef(el) {
    this.setState({ instanceRef: el });
  }

  render() {
    if (!this.props.wrapper) return null;
    if (!this.props.wrapper.ref) return null;

    const { duration, wrapper } = this.props;
    const { start, end } = this.state;
    const { width } = wrapper.rect;

    const x1 = (start * width) / duration;
    const x2 = (end * width) / duration;

    const instanceLength = end - start;
    const instanceWidth = (instanceLength * width) / duration;

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

    const renderPopover = popupState => {
      if (this.state.dragging || !this.state.instanceRef) return null;
      if (this.state.overHandle) {
        return (
          <HandlePopover
            instanceRef={this.state.instanceRef}
            popupState={popupState}
          />
        );
      }
      if (this.state.overInstance) {
        return (
          <InstancePopover
            instanceRef={this.state.instanceRef}
            instancePopoverChildren={<>Hello</>}
            popupState={popupState}
          />
        );
      }
      return null;
    };

    return (
      <>
        <PopupState variant="popover" popupId="InstancePopover">
          {popupState => (
            <>
              <RSInstance
                style={{
                  left: `${x1}px`,
                  width: `${instanceWidth}px`,
                  zIndex: this.state.overInstance ? `1000` : `default`
                }}
                onMouseEnter={e => this.onInstanceEnter(e, popupState)}
                onMouseLeave={e => this.onInstanceLeave(e, popupState)}
              />

              {handles.map(handle => {
                const { edge, value } = handle;
                return (
                  <RSHandle
                    isVisible={
                      this.state.overInstance ||
                      this.state.dragging === edge ||
                      this.state.overHandle === edge
                    }
                    key={edge}
                    onMouseDown={e => this.onMouseDown(e, edge)}
                    onMouseEnter={e => this.onHandleEnter(e, edge)}
                    onMouseLeave={e => this.onHandleLeave(e, edge)}
                    style={{
                      left: edge === "start" ? `${x1 - 4}px` : `${x2 - 4}px`
                    }}
                  >
                    {this.state.overHandle === edge ||
                    this.state.dragging === edge ? (
                      <MeTooltip isVisible>{formatSeconds(value)}</MeTooltip>
                    ) : null}
                  </RSHandle>
                );
              })}

              {renderPopover(popupState)}
            </>
          )}
        </PopupState>
      </>
    );
  }
}

export default Instance;

Instance.propTypes = {
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
