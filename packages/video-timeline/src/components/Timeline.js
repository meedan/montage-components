import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Tooltip from '@material-ui/core/Tooltip';

import formatTime from './ofTimeline/formatTime';
import TimelineClips from './ofTimeline/Clips';
import TimelineComments from './ofTimeline/Comments';
import TimelinePlaces from './ofTimeline/Places';
import TimelineTags from './ofTimeline/Tags';

import { color } from '@montage/ui';

const TimelinePlayheadWrapper = styled.div`
  user-select: none;
`;

const TimelinePlayhead = styled(({ pxOffset, ...props }) => <div {...props} />)`
  bottom: 0;
  left: ${({ pxOffset }) => pxOffset + 'px'};
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
  .rc-slider {
    height: 100%;
    padding: 0;
  }
  .rc-slider,
  .rc-slider-track,
  .rc-slider-rail {
    background: transparent;
  }
  .rc-slider-disabled {
    .rc-slider-mark-text {
      cursor: pointer !important;
    }
  }
`;

const TimelinePlayheadThumb = styled(({ pxOffset, position, ...props }) => (
  <div {...props} />
))`
  background: rgba(0, 0, 0, 0.033);
  cursor: col-resize;
  cursor: -webkit-grab;
  cursor: grab;
  height: 100%;
  pointer-events: all;
  position: absolute;
  touch-action: pan-x;
  transform: translateX(-50%);
  width: 13px;
  &:before {
    background: ${color.brand};
    border-radius: 100%;
    content: ' ';
    display: block;
    height: 9px;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translate(-50%, -50%);
    width: 9px;
  }
  &:after {
    border-left: 1px solid ${color.brand};
    content: ' ';
    display: block;
    height: 100%;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    width: 1px;
  }
`;

const styles = theme => ({});

const pxOffset = 224;

class Timeline extends Component {
  state = {
    ffTime: 0,
    time: 0,
    skip: false,
    disjoint: false,
    playing: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { currentTime } = props;
    let { time, events, skip, disjoint } = state;

    disjoint = disjoint && Math.floor(time / 5) !== Math.floor(currentTime / 5);
    time = disjoint ? time : currentTime;

    return { time, events, skip, disjoint };
  }

  onTrackClick = e => {
    return false;
    if (this.state.skip) {
      console.log('skipping click due to drag state on');
      return;
    }
    const { player, duration, playPause, playing } = this.props;

    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = rect.left + pxOffset;
    const endPos = rect.width;
    const newPos = e.clientX - startPos;
    const newPosFlat = newPos > 0 ? newPos : 0;
    const newTime = (duration * newPosFlat) / (endPos - pxOffset);

    if (player && e.clientX > startPos) {
      this.setState({ time: newTime, skip: false, disjoint: true });

      console.log(`seeking to ${newTime}`);
      player.seekTo(newTime);
      if (!playing) playPause();
    } else {
      // console.log('skipping because player && e.clientX > startPos is false');
    }

    return null;
  };

  onDragStart = (val, skip = true) => {
    // console.log('dragStart', this.props.playing);
    this.setState({ skip, ffTime: val, disjoint: true, playing: this.props.playing });

    // pause
    if (this.props.playing) this.props.playPause();
  };

  onDrag = (val, skip = true) => {
    // console.log('dragging', this.props.playing);
    const { player, playing } = this.props;

    this.setState({ time: val, skip, disjoint: true, playing: playing || this.state.playing });
    if (player) setTimeout(() => {
      console.log(`seeking to ${val}`);
      player.seekTo(val);
    }, 0);

    // pause
    if (playing) this.props.playPause();
  };

  onDragEnd = val => {
    if (this.state.playing && !this.props.playing) this.props.playPause();
    setTimeout(() => this.setState({ skip: false, playing: false }), 100);
  };

  render() {
    const { time, skip, ffTime } = this.state;
    const { duration } = this.props;

    const props = Object.keys(this.props).reduce(
      (acc, k) => {
        if (!acc[k]) acc[k] = this.props[k];
        return acc;
      },
      { currentTime: skip ? ffTime : time }
    );

    return (
      <TimelinePlayheadWrapper onClick={e => this.onTrackClick(e)}>
        <TimelinePlayhead pxOffset={pxOffset}>
          <Slider
            defaultValue={0}
            handle={props => (
              <Tooltip title={formatTime(time)} placement="top">
                <TimelinePlayheadThumb style={{ left: `${props.offset}%` }} />
              </Tooltip>
            )}
            max={duration}
            min={0}
            onAfterChange={this.onDragEnd}
            onBeforeChange={this.onDragStart}
            onChange={this.onDrag}
            value={this.state.time}
          />
        </TimelinePlayhead>
        <Table padding="dense">
          <TimelineComments {...props} skip={skip} />
          <TimelineClips {...props} skip={skip} />
          <TimelineTags
            {...props} skip={skip}
            onAfterChange={v => this.onDragEnd(v)}
            onBeforeChange={v => this.onDragStart(v, false)}
            onChange={v => this.onDrag(v, false)}
          />
          <TimelinePlaces {...props} />
        </Table>
      </TimelinePlayheadWrapper>
    );
  }
}

export default withStyles(styles)(Timeline);
