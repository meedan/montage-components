import { number, shape, object } from "prop-types";
import React, { createRef, Component } from "react";
import styled from "styled-components";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";

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
  ${({ pos }) => (pos === "start" ? `left: 0` : `right: 0;`)};
  background: rgba(71, 123, 181, 1);
  bottom: 0;
  cursor: ew-resize;
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  position: absolute;
  top: 0;
  transform: ${({ pos }) => `translateX(${pos === "start" ? `-50%` : `50%`})`};
  transition: transform 250ms, opacity 250ms;
  width: 3px;
  z-index: 1;
  &:hover {
    opacity: 1 !important;
  }
`;

class Instance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overInstance: null,
      dragging: null,
      overHandle: null
    };
    this.onInstanceEnter = this.onInstanceEnter.bind(this);
    this.onInstanceLeave = this.onInstanceLeave.bind(this);
    this.onHandleEnter = this.onHandleEnter.bind(this);
    this.onHandleLeave = this.onHandleLeave.bind(this);

    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.onHandleDragEnd = this.onHandleDragEnd.bind(this);
    this.onHandleDragStart = this.onHandleDragStart.bind(this);

    this.updateEdge = this.updateEdge.bind(this);
    this.updateRef = this.updateRef.bind(this);

    this.instanceRef = createRef();
  }

  componentDidMount() {
    this.setState({
      end: this.props.end,
      start: this.props.start
    });
    return null;
  }

  onInstanceEnter(e) {
    console.log("onInstanceEnter", e.target);
    this.setState({ overInstance: true });
    this.updateRef(e.target);
  }

  onInstanceLeave() {
    console.log("onInstanceLeave", null);
    this.setState({ overInstance: null });
  }

  onHandleEnter(e) {
    console.log("onHandleEnter", e.target);
    this.setState({ overHandle: true });
    this.updateRef(e.target);
  }

  onHandleLeave() {
    console.log("onHandleLeave", null);
    this.setState(prevState => ({
      overHandle: null,
      overInstance: prevState.overInstance ? prevState.overInstance : null
    }));
    this.updateRef(this.state.overInstance ? this.instanceRef.current : null);
  }

  onHandleDragStart(e, edge) {
    this.setState({
      overInstance: true,
      dragging: edge
    });
    const img = document.createElement("img");
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAFoEvQfAAAABGdBTUEAALGPC/xhBQAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC";
    e.dataTransfer.dropEffect = "none";
    e.dataTransfer.effectAllowed = "none";
    e.dataTransfer.setData("text/plain", "foo");
    e.dataTransfer.setDragImage(img, 0, 0);
  }

  onHandleDrag(e, edge) {
    this.setState(
      {
        overHandle: edge,
        overInstance: true
      },
      () => this.updateEdge(edge)
    );
  }

  onHandleDragEnd(e, edge) {
    this.setState(
      {
        dragging: null,
        overHandle: null,
        overInstance: null
      },
      () => this.updateEdge(edge)
    );
  }

  updateEdge(edge) {
    const { coords, duration, wrapper } = this.props;
    const { width, left } = wrapper.rect;
    const { end, start } = this.state;
    const minLength = (6 * duration) / width;

    if (coords.x <= 0) return null;
    let newTime = ((coords.x - left) * duration) / width;

    if (edge === "start" && newTime > end - minLength) {
      newTime = end - minLength < 0 ? 0 : end - minLength;
    }
    if (edge === "end" && newTime < start + minLength) {
      newTime = start + minLength > duration ? duration : start + minLength;
    }

    this.setState(prevState => ({
      [edge]: newTime > 0 && newTime < duration ? newTime : prevState[edge]
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
    const { width } = wrapper.rect;

    const x1 = (this.state.start * width) / duration;
    const x2 = width - (this.state.end * width) / duration;

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

    // console.group("Instance.js");
    // console.log(this.instanceRef);
    // console.groupEnd();

    const renderPopoverContent = popupState => {
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
      <PopupState variant="popover" popupId="InstancePopover">
        {popupState => (
          <RSInstance
            style={{
              left: `${x1}px`,
              right: `${x2}px`,
              zIndex: this.state.overInstance ? `1000` : `default`
            }}
            onMouseEnter={e => this.onInstanceEnter(e)}
            onMouseLeave={this.onInstanceLeave}
            onMouseMove={e => this.updateRef(e.target)}
          >
            <div style={{ height: "28px" }} ref={this.instanceRef}>
              {handles.map(handle => {
                const { value, edge } = handle;
                return (
                  <RSHandle
                    draggable
                    isVisible={
                      this.state.overInstance || this.state.dragging === edge
                    }
                    key={edge}
                    onDrag={e => this.onHandleDrag(e, edge)}
                    onDragEnd={e => this.onHandleDragEnd(e, edge)}
                    onDragStart={e => this.onHandleDragStart(e, edge)}
                    onMouseEnter={e => this.onHandleEnter(e, edge)}
                    onMouseLeave={e => this.onHandleLeave(e, edge)}
                    pos={edge}
                  >
                    <MeTooltip
                      isVisible={
                        this.state.overHandle === edge ||
                        this.state.dragging === edge
                      }
                    >
                      {formatSeconds(value)}
                    </MeTooltip>
                  </RSHandle>
                );
              })}
              {renderPopoverContent(popupState)}
              <style scoped>
                {"#InstancePopover { pointer-events: none; }"}
              </style>
            </div>
          </RSInstance>
        )}
      </PopupState>
    );
  }
}

export default Instance;

Instance.propTypes = {
  coords: shape({ x: number.isRequired, y: number.isRequired }).isRequired,
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
