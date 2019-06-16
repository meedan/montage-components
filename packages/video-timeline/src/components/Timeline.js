import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';
import { number, shape } from 'prop-types';
import { throttle } from 'lodash';
import React, { Component, createRef } from 'react';
import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import grey from '@material-ui/core/colors/grey';

import Entities from './ofTimeline/Entities';
import TimelineComments from './ofTimeline/Comments';

import { TimelinePlayhead } from '@montage/ui';

import { play, pause, seekTo } from '../reducers/player';

const DISABLE_TIMELINE_TRANSPORT = false;
const DISABLE_TRACK_TRANSPORT = false;
const TIMELINE_OFFSET = 224;

const TimelineWrapper = styled.div`
  border-left: 1px solid ${grey[300]};
  border-right: 1px solid ${grey[300]};
  margin-left: auto;
  margin-right: auto;
  max-width: 1500px;
  min-height: 500px;
  padding-bottom: 300px;
  position: relative;
  user-select: none;
`;
const TimelinePlayheadPin = styled.div`
  bottom: 0;
  left: ${TIMELINE_OFFSET}px;
  position: absolute;
  right: 0;
  top: 0;
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
    this.playheadTrackEl = createRef();
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

  componentDidMount() {
    document.addEventListener('resize', this.setPlayheadStyles.bind(this));
    this.setPlayheadStyles();
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.setPlayheadStyles.bind(this));
  }

  setPlayheadStyles() {
    if (!this.playheadTrackEl) return null;
    if (!this.playheadTrackEl.current) return null;
    const rect = this.playheadTrackEl.current.getBoundingClientRect();
    this.setState({
      playheadTrackStyle: {
        bottom: 0,
        left: rect.left,
        position: 'fixed',
        top: rect.top,
        width: rect.width,
        zIndex: '150',
      },
    });
  }

  // onTrackClick = e => {
  //   if (this.state.clip) {
  //     return;
  //   }
  //
  //   const { box, play, duration, playing } = this.props;
  //
  //   const startPos = box.x1 + TIMELINE_OFFSET;
  //   const endPos = box.width - TIMELINE_OFFSET;
  //   const newPos = e.clientX - startPos;
  //   const newPosFlat = newPos > 0 ? newPos : 0;
  //   const newTime = (duration * newPosFlat) / endPos;
  //   // console.log('onTrackClick()');
  //   if (e.clientX > startPos && !DISABLE_TIMELINE_TRANSPORT) {
  //     this.setState({ time: newTime, disjoint: true, seekTo: newTime });
  //     console.log(`seeking to ${newTime} (onTrackClick)`);
  //     if (!playing) play({ transport: 'timeline' });
  //   }
  //   return null;
  // };

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

  onPlayheadChange = (time, skip = true, clip = false) => {
    const { pause, playing } = this.props;

    this.setState({
      time: clip ? this.state.time : time,
      clip,
      skip,
      seekTo: time,
      dragging: true,
      disjoint: true,
      playing: playing || this.state.playing,
    });

    // pause
    if (playing) pause({ transport: clip ? 'downstream' : 'timeline' });
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
      <TimelineWrapper
        // onClick={e => this.onTrackClick(e)}
        onClick={e => console.log('TimelineWrapperClick', e)}
      >
        <TimelinePlayheadPin ref={this.playheadTrackEl}>
          <TimelinePlayhead
            duration={duration}
            onTimeChange={throttle(this.onPlayheadChange, 150)}
            style={this.state.playheadTrackStyle}
            time={this.state.time}
          />
        </TimelinePlayheadPin>
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
      </TimelineWrapper>
    );
  }
}

Timeline.defaultProps = {};

Timeline.propTypes = {};

export default connect(
  null,
  { play, pause, seekTo }
)(Timeline);
