import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';
import React, { Component, createRef } from 'react';
import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import grey from '@material-ui/core/colors/grey';

import Entities from './ofTimeline/Entities';
import TimelineComments from './ofTimeline/Comments';

import { TimelinePlayhead } from '@montage/ui';

import { play, pause, update } from '../reducers/player';

const DISABLE_TIMELINE_TRANSPORT = false;
const DISABLE_TRACK_TRANSPORT = false;
const TIMELINE_OFFSET = 224;

const TimelineRoot = styled.div`
  bottom: 0;
  left: 0;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: 0;
`;
const TimelineWrapper = styled.div`
  border-left: 1px solid ${grey[200]};
  border-right: 1px solid ${grey[200]};
  margin-left: auto;
  margin-right: auto;
  max-width: 1500px;
  min-height: 500px;
  padding-bottom: 300px;
  position: relative;
  user-select: none;
`;
const TimelinePlayheadTrackWrapper = styled.div`
  border-left: 1px solid #e0e0e0;
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!nextState.skip) return true;
  //   return false;
  // }

  componentDidMount() {
    window.addEventListener('resize', this.setPlayheadStyles.bind(this));
    document.addEventListener('resize', this.setPlayheadStyles.bind(this));
    this.setPlayheadStyles();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setPlayheadStyles.bind(this));
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

    this.props.update({ trackWidth: rect.width });
  }

  onTrackClick = e => {
    if (this.state.clip) {
      return;
    }

    const { play, duration, playing } = this.props;

    const rect = this.playheadTrackEl.current.getBoundingClientRect();
    const newTime = ((e.pageX - rect.left) * duration) / rect.width;

    if (!DISABLE_TIMELINE_TRANSPORT) {
      this.setState({
        time: newTime,
        disjoint: true,
        skip: false,
        seekTo: newTime,
      });
      console.log(`seeking to ${newTime} (onTrackClick)`);
      if (!playing) play({ transport: 'timeline' });
      this.seekTo(newTime);
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
    if (this.props.playing) this.props.pause({ transport: clip ? 'downstream' : 'timeline' });
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

    this.seekTo(val);
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

    this.seekTo(this.state.time);
  };

  onTimeChange = (time, skip = true, clip = false) => {
    const { pause, playing } = this.props;

    this.setState({
      time: clip ? this.state.time : time,
      ffTime: clip ? this.state.time : time,
      clip,
      skip,
      seekTo: time,
      dragging: true,
      disjoint: true,
      playing: playing || this.state.playing,
    });

    // pause
    if (playing) pause({ transport: clip ? 'downstream' : 'timeline' });

    this.seekTo(time);
  };

  seekTo = time => {
    if (!DISABLE_TIMELINE_TRANSPORT) {
      this.props.seekTo(time);
    }
  };

  render() {
    const { time, skip, ffTime } = this.state;
    const { duration, transport, playing } = this.props;

    const currentTime = skip ? ffTime : time;

    return (
      <TimelineRoot>
        <TimelineWrapper>
          <TimelinePlayheadTrackWrapper ref={this.playheadTrackEl} onClick={e => this.onTrackClick(e)}>
            <TimelinePlayhead
              duration={duration}
              onTimeChange={this.onTimeChange}
              style={this.state.playheadTrackStyle}
              time={time}
            />
          </TimelinePlayheadTrackWrapper>
          <Table padding="dense">
            <TimelineComments {...this.props} currentTime={currentTime} />
            <Entities
              title="Clips"
              entityType="clip"
              key="clip"
              currentTime={currentTime}
              duration={duration}
              onAfterChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true))}
              onBeforeChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true))}
              onChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true))}
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
              key="tag"
              currentTime={currentTime}
              duration={duration}
              onAfterChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true))}
              onBeforeChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true))}
              onChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true))}
              entities={this.props.data.videoTags}
              clips={this.props.data.videoClips}
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
              key="location"
              currentTime={currentTime}
              duration={duration}
              onAfterChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragEnd(v, true))}
              onBeforeChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDragStart(v, false, true))}
              onChange={v => (DISABLE_TRACK_TRANSPORT ? null : this.onDrag(v, false, true))}
              entities={this.props.data.videoPlaces}
              clips={this.props.data.videoClips}
              entitiesyKey={'videoPlaces'}
              playing={playing}
              transport={transport}
              suggestions={this.props.data.project.projectplaces}
              skip={skip}
              timelineOffset={this.props.x1}
            />
          </Table>
        </TimelineWrapper>
      </TimelineRoot>
    );
  }
}

// const mergeInstances = entities =>
//   produce(entities, nextEntities =>
//     nextEntities.forEach(e => {
//       e.isCreating = false;
//       e.instances = e.instances
//         .sort((j, i) => j.start_seconds - i.start_seconds)
//         .reduce((acc = [], i) => {
//           const j = acc.pop();
//
//           if (j) {
//             if (j.start_seconds <= i.start_seconds && i.start_seconds < j.end_seconds) {
//               j.start_seconds = Math.min(j.start_seconds, i.start_seconds);
//               j.end_seconds = Math.max(j.end_seconds, i.end_seconds);
//               acc.push(j);
//               return acc;
//             }
//
//             acc.push(j);
//           }
//
//           return [...acc, i];
//         }, []);
//     })
//   );

export default connect(
  null,
  { play, pause, update }
)(Timeline);
