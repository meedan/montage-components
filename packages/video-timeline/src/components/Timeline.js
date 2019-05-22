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

import { color, MeTooltip } from '@montage/ui';

import { play, pause, seekTo } from '../reducers/player';

const DISABLE_TIMELINE_TRANSPORT = false;
const DISABLE_TRACK_TRANSPORT = false;
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
    if (this.state.clip) {
      return;
    }

    const { box, play, duration, playing } = this.props;

    const startPos = box.x1 + TIMELINE_OFFSET;
    const endPos = box.width - TIMELINE_OFFSET;
    const newPos = e.clientX - startPos;
    const newPosFlat = newPos > 0 ? newPos : 0;
    const newTime = (duration * newPosFlat) / endPos;
    // console.log('onTrackClick()');
    if (e.clientX > startPos && !DISABLE_TIMELINE_TRANSPORT) {
      this.setState({ time: newTime, disjoint: true, seekTo: newTime });
      console.log(`seeking to ${newTime} (onTrackClick)`);
      if (!playing) play({ transport: 'timeline' });
    }
    return null;
  };

  onDragStart = (val, skip = true, clip = false) => {
    // console.log('dragStart');
    this.setState({
      disjoint: true,
      dragging: true,
      ffTime: this.state.time,
      playing: this.props.playing,
      skip,
    });

    // pause
    if (this.props.playing)
      this.props.pause({ transport: clip ? 'downstream' : 'timeline' });
  };

  onDrag = (val, skip = true, clip = false) => {
    // console.log('dragging');
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

    // pause
    if (playing) pause({ transport: clip ? 'downstream' : 'timeline' });
  };

  onDragEnd = (val, clip = false) => {
    // console.log('dragEnd');
    // if (this.state.playing && !this.props.playing) this.props.play();
    setTimeout(
      () =>
        this.setState({
          clip,
          seekTo: this.state.time,
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
              return (
                <PlayheadMarker
                  style={{ left: `${props.offset}%` }}
                  onMouseEnter={() => this.setState({ showTimestamp: true })}
                  onMouseLeave={() => this.setState({ showTimestamp: false })}
                >
                  <MeTooltip
                    isVisible={this.state.showTimestamp || this.state.dragging}
                  >
                    {formatTime(time)}
                  </MeTooltip>
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
              DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true)
            }
            onBeforeChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true)
            }
            onChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true)
            }
            entities={this.props.data.videoClips}
            entitiesyKey={'videoClips'}
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
              DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true)
            }
            onBeforeChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true)
            }
            onChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true)
            }
            entities={this.props.data.videoTags}
            entitiesyKey={'videoTags'}
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
              DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true)
            }
            onBeforeChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true)
            }
            onChange={v =>
              DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true)
            }
            entities={this.props.data.videoPlaces}
            entitiesyKey={'videoPlaces'}
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
