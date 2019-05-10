import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';
import { number, shape } from 'prop-types';
import React, { Component } from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';

import Entities from './ofTimeline/Entities';
import formatTime from './ofTimeline/formatTime';
import TimelineComments from './ofTimeline/Comments';

import { color } from '@montage/ui';

import { play, pause, seekTo } from '../reducers/player';

const DISABLE_TIMELINE_TRANSPORT = true;
const DISABLE_TRACK_TRANSPORT = true;
const TIMELINE_OFFSET = 224;

const Playhead = styled(({ box, ...props }) => <div {...props} />)`
  ${({ box }) => `
    height: ${box.height}px;
    left: ${box.x1 + TIMELINE_OFFSET}px;
    top: ${box.y1}px;
    width: ${box.width - TIMELINE_OFFSET}px;
  `}
  border-left: 1px solid ${grey[300]};
  pointer-events: none;
  position: fixed;
  z-index: 100;
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

const PlayheadMarker = styled.div`
  background: ${color.shadow100};
  cursor: -webkit-grab;
  cursor: col-resize;
  cursor: grab;
  height: 100%;
  pointer-events: all;
  position: absolute;
  touch-action: pan-x;
  transform: translateX(-50%);
  width: 6px;
`;
const PlayheadTimestamp = styled.div`
  background: ${color.shadow600};
  border-radius: 3px;
  bottom: 100%;
  color: ${grey[50]};
  display: ${({ hide }) => (hide ? 'none' : 'block')};
  left: 50%;
  padding: 3px 6px;
  position: absolute;
  transform: translate(-50%, -66%);
  z-index: 10001;
`;

const PlayheadThumb = styled(({ pxOffset, position, ...props }) => (
  <div {...props} />
))`
  &:before {
    background: ${color.brand};
    border-radius: 100%;
    content: ' ';
    display: block;
    height: 6px;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translate(-50%, -50%);
    width: 6px;
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

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clip: false,
      disjoint: false,
      ffTime: 0,
      playing: false,
      seekTo: null,
      showTimestamp: false,
      skip: false,
      time: 0,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { currentTime } = props;
    let { time, events, skip, disjoint, clip, ffTime } = state;

    disjoint = disjoint && Math.floor(time / 5) !== Math.floor(currentTime / 5);
    time = disjoint ? time : currentTime;
    time = clip ? ffTime : time;

    return { time, events, skip, disjoint };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.seekTo !== this.state.seekTo && !DISABLE_TIMELINE_TRANSPORT) {
      this.props.seekTo({ seekTo: this.state.seekTo, transport: 'timeline' });
    }
  }

  onTrackClick = e => {
    // if (this.state.skip || this.state.clip) {
    //   console.log('skipping click due to drag state on');
    //   return;
    // }
    const { box, seekTo, play, duration, playing } = this.props;

    const startPos = box.x1 + TIMELINE_OFFSET;
    const endPos = box.width - TIMELINE_OFFSET;
    const newPos = e.clientX - startPos;
    const newPosFlat = newPos > 0 ? newPos : 0;
    const newTime = (duration * newPosFlat) / endPos;
    console.log('onTrackClick()');
    if (e.clientX > startPos && !DISABLE_TIMELINE_TRANSPORT) {
      this.setState({ time: newTime, disjoint: true });
      console.log(`seeking to ${newTime}`);
      if (!playing) play({ transport: 'timeline' });
      seekTo({ seekTo: newTime, transport: 'timeline' });
    }
    return null;
  };

  onDragStart = (val, skip = true) => {
    console.log('dragStart');
    this.setState({
      disjoint: true,
      dragging: true,
      ffTime: val,
      playing: this.props.playing,
      skip,
    });

    // pause
    if (this.props.playing) this.props.pause({ transport: 'timeline' });
  };

  onDrag = (val, skip = true, clip = false) => {
    console.log('dragging');
    const { pause, playing } = this.props;

    this.setState({
      time: clip ? this.state.time : val,
      clip,
      skip,
      seekTo: val,
      dragging: true,
      disjoint: true,
      playing: playing || this.state.playing,
    });

    // if (!DISABLE_TIMELINE_TRANSPORT) {
    //   setTimeout(() => {
    //     console.log(`seeking to ${val}`);
    //     this.props.seekTo({ seekTo: val, transport: 'timeline' });
    //   }, 0);
    // }

    // pause
    if (playing) pause({ transport: 'timeline' });
  };

  onDragEnd = val => {
    console.log('dragEnd');
    // if (this.state.playing && !this.props.playing) this.props.play();
    setTimeout(
      () =>
        this.setState({
          clip: false,
          dragging: false,
          playing: false,
          skip: false,
        }),
      300
    );
  };

  registerDuplicateAsClip = fn => {
    this.duplicateAsClip = fn;
  };

  relayDuplicateAsClip = (entity, instance, entityType = 'tag') => {
    // console.log(tag, instance);
    if (this.duplicateAsClip)
      this.duplicateAsClip(entity, instance, entityType);
  };

  render() {
    const { time, skip, ffTime } = this.state;
    const { duration, transport, playing } = this.props;

    const currentTime = skip ? ffTime : time;

    return (
      <div style={{ userSelect: 'none' }} onClick={e => this.onTrackClick(e)}>
        <Playhead box={this.props.box}>
          <Slider
            defaultValue={0}
            handle={props => {
              // <Tooltip title={formatTime(time)} placement="top">
              // </Tooltip>
              return (
                <PlayheadMarker
                  style={{ left: `${props.offset}%` }}
                  onMouseEnter={() => this.setState({ showTimestamp: true })}
                  onMouseLeave={() => this.setState({ showTimestamp: false })}
                >
                  <PlayheadTimestamp
                    hide={!this.state.showTimestamp && !this.state.dragging}
                  >
                    <Typography
                      variant="overline"
                      style={{
                        color: 'white',
                        lineHeight: '1.3em',
                      }}
                    >
                      {formatTime(time)}
                    </Typography>
                  </PlayheadTimestamp>
                  <PlayheadThumb />
                </PlayheadMarker>
              );
            }}
            max={duration}
            min={0}
            onAfterChange={this.onDragEnd}
            onBeforeChange={this.onDragStart}
            onChange={this.onDrag}
            value={this.state.time}
          />
        </Playhead>
        <Table padding="dense">
          <TimelineComments
            {...this.props}
            currentTime={currentTime}
            skip={skip}
          />
          <Entities
            title="Clips"
            entityType="clip"
            currentTime={currentTime}
            registerDuplicateAsClip={fn => this.registerDuplicateAsClip(fn)}
            duration={duration}
            onAfterChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v)
            }
            onBeforeChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false)
            }
            onChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, true, true)
            }
            entities={this.props.data.videoClips}
            playing={playing}
            transport={transport}
            suggestions={this.props.data.project.projectclips}
            skip={skip}
            timelineOffset={this.props.x1}
          />
          <Entities
            title="Tags"
            entityType="tag"
            currentTime={currentTime}
            duplicateAsClip={this.relayDuplicateAsClip}
            duration={duration}
            onAfterChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v)
            }
            onBeforeChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false)
            }
            onChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, true, true)
            }
            entities={this.props.data.videoTags}
            playing={playing}
            transport={transport}
            suggestions={this.props.data.project.projecttags}
            skip={skip}
            timelineOffset={this.props.x1}
          />
          <Entities
            title="Places"
            entityType="location"
            currentTime={currentTime}
            duplicateAsClip={this.relayDuplicateAsClip}
            duration={duration}
            onAfterChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v)
            }
            onBeforeChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false)
            }
            onChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, true, true)
            }
            entities={this.props.data.videoPlaces}
            playing={playing}
            transport={transport}
            suggestions={this.props.data.project.projectplaces}
            skip={skip}
            timelineOffset={this.props.x1}
          />
        </Table>
      </div>
    );
  }
}

Timeline.defaultProps = {
  box: {
    height: 0,
    width: 0,
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
  },
};

Timeline.propTypes = {
  box: shape({
    height: number,
    width: number,
    x1: number,
    x2: number,
    x3: number,
    x4: number,
  }),
};

export default connect(
  null,
  { play, pause, seekTo }
)(Timeline);
