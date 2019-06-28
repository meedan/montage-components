import { array, bool, func, number, object, shape } from 'prop-types';
import PopupState, { bindHover } from 'material-ui-popup-state';
import React, { Component } from 'react';
import styled from 'styled-components';
import { filter, minBy, maxBy } from 'lodash';

import { MeTooltip, formatSeconds } from '@montage/ui';

import HandlePopover from './HandlePopover';
import InstancePopover from './InstancePopover';

const RSInstance = styled(({ ...props }) => <div {...props} />)`
  backface-visibility: visible;
  background: rgba(71, 123, 181, 0.4);
  bottom: 0;
  position: absolute;
  top: 0;
  &:hover {
    z-index: 3000;
  }
`;

const RSHandle = styled(({ isDragging, isVisible, pos, ...props }) => (
  <div {...props} />
))`
  background: rgba(71, 123, 181, 1);
  bottom: 0;
  cursor: ew-resize;
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  position: absolute;
  top: 0;
  transform: ${({ pos }) => (pos === 'end' ? `translateX(-50%)` : ``)};
  transition: transform 250ms, opacity 250ms, width 250ms;
  width: ${({ isDragging }) => (isDragging ? 1 : 4)}px;
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
      overHandle: null,
      overInstance: null,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.onHandleEnter = this.onHandleEnter.bind(this);
    this.onHandleLeave = this.onHandleLeave.bind(this);
    this.onInstanceEnter = this.onInstanceEnter.bind(this);
    this.onInstanceLeave = this.onInstanceLeave.bind(this);

    this.moveHandle = this.moveHandle.bind(this);
  }

  componentDidMount() {
    this.setState({
      end: this.props.end,
      start: this.props.start,
    });
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.end !== prevProps.end ||
      this.props.start !== prevProps.start
    ) {
      this.setState({
        end: this.props.end,
        start: this.props.start,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onInstanceEnter() {
    this.setState({ overInstance: true });
  }

  onInstanceLeave() {
    this.setState({ overInstance: null, overHandle: null });
  }

  onHandleEnter(e, edge) {
    this.setState({ overHandle: edge });
  }

  onHandleLeave() {
    this.setState(prevState => ({
      overHandle: null,
      overInstance: prevState.overInstance ? prevState.overInstance : null,
    }));
  }

  onMouseDown(edge) {
    this.setState({ dragging: edge });
    this.props.setDraggedInstance(this.props.id);
  }

  onMouseMove(e) {
    if (!e) return null;
    const coords = { x: e.pageX, y: e.pageY };
    this.setState({ coords });

    if (!this.state.dragging) return null;
    const { duration, wrapper, instances } = this.props;
    const { dragging, end, start } = this.state;
    const { width, left } = wrapper.rect;
    const MIN_LENGTH = (6 * duration) / width;

    const prevInstance = maxBy(
      filter(instances, i => i.end_seconds <= start),
      i => i.end_seconds
    );
    const nextInstance = minBy(
      filter(instances, i => i.start_seconds >= end),
      i => i.start_seconds
    );
    const RANGE_MIN = prevInstance ? prevInstance.end_seconds : 0;
    const RANGE_MAX = nextInstance ? nextInstance.start_seconds : duration;

    if (coords.x <= 0) return null;
    let newTime = ((coords.x - left) * duration) / width;

    if (dragging === 'start' && newTime > end - MIN_LENGTH) {
      newTime = end - MIN_LENGTH < 0 ? 0 : end - MIN_LENGTH;
    }
    if (dragging === 'end' && newTime < start + MIN_LENGTH) {
      newTime = start + MIN_LENGTH > duration ? duration : start + MIN_LENGTH;
    }

    this.setState(prevState => ({
      coords,
      [dragging]:
        newTime >= RANGE_MIN && newTime <= RANGE_MAX
          ? newTime
          : prevState[dragging],
    }));

    return null;
  }

  onMouseUp() {
    if (!this.state.dragging) return null;
    this.setState({ dragging: null }, () => {
      this.props.setDraggedInstance(null);
      this.props.updateInstance({
        start_seconds: this.state.start,
        end_seconds: this.state.end,
      });
    });
    return null;
  }

  moveHandle(edge, dir) {
    const { end, start } = this.state;
    const { duration, instances } = this.props;

    const prevInstance = maxBy(
      filter(instances, i => i.end_seconds <= start),
      i => i.end_seconds
    );
    const nextInstance = minBy(
      filter(instances, i => i.start_seconds >= end),
      i => i.start_seconds
    );
    const RANGE_MAX = nextInstance ? nextInstance.start_seconds : duration;
    const RANGE_MIN = prevInstance ? prevInstance.end_seconds : 0;
    const UNIT = duration / this.props.wrapper.rect.width;

    const calcVal = prevState => {
      if (dir === 'fwd') {
        return prevState[edge] + UNIT < RANGE_MAX
          ? prevState[edge] + UNIT
          : RANGE_MAX;
      }
      if (dir === 'bwd') {
        return prevState[edge] - UNIT > RANGE_MIN
          ? prevState[edge] - UNIT
          : RANGE_MIN;
      }
      return null;
    };
    this.setState(
      prevState => ({
        [edge]: calcVal(prevState),
      }),
      () =>
        this.props.updateInstance({
          start_seconds: this.state.start,
          end_seconds: this.state.end,
        })
    );
  }

  render() {
    if (!this.props.wrapper) return null;
    if (!this.props.wrapper.ref) return null;

    const { isLocked, duration, wrapper } = this.props;
    const { end, start } = this.state;
    const { width } = wrapper.rect;

    const x1 = (start * width) / duration;
    const x2 = (end * width) / duration;

    const instanceLength = end - start;
    const instanceWidth = (instanceLength * width) / duration;

    const handles = [
      {
        edge: 'end',
        value: this.state.end,
      },
      {
        edge: 'start',
        value: this.state.start,
      },
    ];

    // console.group("Instance.js");
    // console.log(this.state);
    // console.groupEnd();

    return (
      <>
        <PopupState variant="popover" popupId="InstancePopover">
          {popupState => (
            <>
              <RSInstance
                style={{
                  left: `${x1}px`,
                  width: `${instanceWidth}px`,
                  zIndex: this.state.overInstance ? `1000` : `default`,
                }}
                onMouseEnter={!isLocked ? this.onInstanceEnter : null}
                onMouseLeave={!isLocked ? this.onInstanceLeave : null}
              >
                {!isLocked ? (
                  <div
                    {...bindHover(popupState)}
                    style={{ width: `100%`, height: `28px` }}
                  />
                ) : null}
              </RSInstance>
              {!this.state.dragging ? (
                <InstancePopover
                  checkInstance={this.props.checkInstance}
                  clipInstance={this.props.clipInstance}
                  deleteInstance={this.props.deleteInstance}
                  extendInstance={this.props.extendInstance}
                  instance={this.props.instance}
                  popupState={popupState}
                />
              ) : null}
            </>
          )}
        </PopupState>

        {handles.map(handle => {
          const { edge, value } = handle;
          const isHandleActive =
            this.state.dragging === edge || this.state.overHandle === edge;
          return (
            <PopupState
              key={`${edge}Popover`}
              popupId={`${edge}Popover`}
              variant="popover"
            >
              {popupState => (
                <>
                  <RSHandle
                    isDragging={this.state.dragging === edge}
                    isVisible={
                      isHandleActive ||
                      (this.state.overInstance && !this.state.dragging) ||
                      popupState.isOpen
                    }
                    onMouseDown={() => this.onMouseDown(edge)}
                    onMouseEnter={e => this.onHandleEnter(e, edge)}
                    onMouseLeave={this.onHandleLeave}
                    style={{ left: edge === 'start' ? `${x1}px` : `${x2}px` }}
                    pos={edge}
                  >
                    <div
                      style={{ width: `100%`, height: `28px` }}
                      {...bindHover(popupState)}
                    >
                      {isHandleActive ? (
                        <MeTooltip isVisible>{formatSeconds(value)}</MeTooltip>
                      ) : null}
                    </div>
                  </RSHandle>
                  {!this.state.dragging ? (
                    <HandlePopover
                      id={`${edge}Popover`}
                      moveBackward={() => this.moveHandle(edge, 'bwd')}
                      moveForward={() => this.moveHandle(edge, 'fwd')}
                      popupState={popupState}
                    />
                  ) : null}
                </>
              )}
            </PopupState>
          );
        })}
      </>
    );
  }
}

export default Instance;

Instance.propTypes = {
  checkInstance: func,
  clipInstance: func,
  deleteInstance: func.isRequired,
  duration: number.isRequired,
  isLocked: bool,
  end: number.isRequired,
  setDraggedInstance: func.isRequired,
  extendInstance: func.isRequired,
  instances: array.isRequired,
  instance: object.isRequired,
  start: number.isRequired,
  updateInstance: func.isRequired,
  wrapper: shape({
    rect: object.isRequired,
    ref: object.isRequired,
  }),
};

Instance.defaultProps = {
  checkInstance: null,
  clipInstance: null,
  isLocked: null,
  wrapper: null,
};