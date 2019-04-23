import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';
import produce from 'immer';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';

import formatTime from './formatTime';
import TableBlock from './TableBlock';
import TableSection from './TableSection';
import PlaceControls from './ofPlaces/PlaceControls';
import PlaceInstancePopover from './ofPlaces/PlaceInstancePopover';

const Range = Slider.Range;
const Handle = Slider.Handle;

const SliderWrapper = styled.div`
  .rc-slider {
    height: 28px;
    z-index: 1;
  }
  .rc-slider-rail {
    height: 28px;
    background: transparent;
  }
  .rc-slider-track {
    background: rgba(71, 123, 181, 0.4);
    border-radius: 0;
    height: 28px;
    position: absolute;
    top: 0;
  }
  .rc-slider-handle {
    background: rgba(71, 123, 181, 1);
    border-radius: 1px;
    border: none;
    height: 28px;
    margin: 0;
    position: absolute;
    top: 0;
    transform: translateX(-2px);
    transition: background 0.1s;
    width: 4px;
  }
  .rc-slider:hover .rc-slider-handle {
    background: rgba(71, 123, 181, 1);
  }
  .rc-slider:hover .rc-slider-handle,
  .rc-slider-handle:focus {
    box-shadow: none;
  }
  .rc-slider-mark-text {
  }
  .rc-slider-mark-text:hover {
    z-index: 50;
  }
`;

class TimelinePlaces extends Component {
  state = {
    playlist: false,
    values: {},
    mousePosAbs: { x: 0, y: 0 },
  };

  static getDerivedStateFromProps(props, state) {
    const { data, duration, skip } = props;
    const { videoPlaces } = data;

    if (skip) return null;

    if (state.videoPlaces && state.segments) return null;

    // merge overlapping place instances
    videoPlaces.forEach(t => {
      t.instances = t.instances
        .sort((j, i) => j.start_seconds - i.start_seconds)
        .reduce((acc = [], i) => {
          const j = acc.pop();

          if (j) {
            if (
              j.start_seconds <= i.start_seconds &&
              i.start_seconds < j.end_seconds
            ) {
              j.start_seconds = Math.min(j.start_seconds, i.start_seconds);
              j.end_seconds = Math.max(j.end_seconds, i.end_seconds);
              acc.push(j);
              return acc;
            }

            acc.push(j);
          }

          return [...acc, i];
        }, []);
    });

    const segments = recomputeSegments(videoPlaces, duration);
    return { videoPlaces, segments };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.skip) return false;

    if (
      nextProps.currentTime !== this.props.currentTime &&
      this.state.playlist
    ) {
      const segment = this.state.segments.find(
        ([i, s, e]) => s <= nextProps.currentTime && nextProps.currentTime < e
      );
      if (!segment) {
        const nextSegment = this.state.segments.find(
          ([i, s]) => nextProps.currentTime < s
        );
        if (nextSegment) {
          this.props.player.seekTo(nextSegment[1]);
        } else {
          if (this.props.playing) this.props.playPause();
          this.setState({ playlist: false });
        }
      }
    }

    // TODO handle extenal video override, like end of video, buffering, etc

    return true;
  }

  handlePlayPause = () => {
    const { playlist } = this.state;
    console.log(playlist, this.props.playing);

    if (!playlist) {
      if (!this.props.playing) this.props.playPause();
      this.setState({ playlist: true });
    } else {
      if (this.props.playing) this.props.playPause();
      this.setState({ playlist: false });
    }
  };

  handle = props => {
    // console.log(props);
    const { value, index, ...restProps } = props;
    return (
      <Tooltip key={index} placement="top" title={formatTime(value)}>
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  onAfterChange = (v, id) => {
    const { values } = this.state;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onAfterChange(val);
    }

    values[id] = v;
    this.setState({ values });
  };

  onBeforeChange = (v, id) => {
    const { values } = this.state;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onBeforeChange(val);
    }

    values[id] = v;
    this.setState({ values });
  };

  onChange = (v, id) => {
    const { values } = this.state;
    const { duration } = this.props;
    const p = values[id] || [];

    let val;
    if (p.length === v.length) {
      val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onChange(val);
    }

    const j = v.findIndex(d => d === val);

    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      const ti = nextVideoPlaces.findIndex(t => t.id === id);
      const t = nextVideoPlaces[ti];

      const i = t.instances.sort((p, q) => p.start_seconds - q.start_seconds)[
        (j - (j % 2)) / 2
      ];

      if (i && j % 2 === 0) i.start_seconds = val;
      if (i && j % 2 === 1) i.end_seconds = val;
    });

    values[id] = v;
    const segments = recomputeSegments(videoPlaces, duration);
    this.setState({ videoPlaces, segments, values });
  };

  startNewInstance = id => {
    const { currentTime, duration } = this.props;

    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      const ti = nextVideoPlaces.findIndex(t => t.id === id);
      const t = nextVideoPlaces[ti];

      const i = t.instances.find(
        i => i.start_seconds <= currentTime && currentTime < i.end_seconds
      );
      if (i) {
        console.log('cannot make overlapping instances');
      } else {
        t.instances.push({
          id: Math.random()
            .toString(36)
            .substring(2),
          start_seconds: currentTime,
          end_seconds: currentTime + 5,
        });
      }
    });

    const segments = recomputeSegments(videoPlaces, duration);
    this.setState({ videoPlaces, segments });
  };

  startNewPlace = () => {
    const { currentTime, duration } = this.props;
    const id = Math.random()
      .toString(36)
      .substring(2);

    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      nextVideoPlaces.splice(0, 0, {
        id,
        isCreating: true,
        instances: [
          {
            id: Math.random()
              .toString(36)
              .substring(2),
            start_seconds: currentTime,
            end_seconds: currentTime + 5,
          },
        ],
        project_location: {
          name: '',
        },
      });
    });

    const segments = recomputeSegments(videoPlaces, duration);
    this.setState({ videoPlaces, segments });
  };

  stopNewPlace = () => {
    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      nextVideoPlaces.splice(0, 1);
    });

    this.setState({ videoPlaces });
  };

  leMenuOff = ({ clientX, clientY, currentTarget }) => {
    const rect = currentTarget.getBoundingClientRect();
    // console.log(rect, clientX, clientY);

    if (
      rect.x < clientX &&
      clientX < rect.x + rect.width &&
      rect.y < clientY &&
      clientY < rect.y + rect.height
    ) {
      // all fine
    } else {
      // console.log('outside', rect, clientX, clientY);
      this.setState({
        targetInstance: null,
        targetPlace: null,
      });
    }
  };

  leMenu = (e, id) => {
    if (!e) {
      this.setState({
        targetInstance: null,
        targetPlace: null,
      });
      return;
    }

    const pxOffset = 0;
    const { videoPlaces } = this.state;
    const { duration } = this.props;

    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = rect.left + pxOffset;
    const endPos = rect.width;
    const mousePos = e.clientX - startPos;
    const mousePosFlat = mousePos > 0 ? mousePos : 0;
    const mouseTime = (duration * mousePosFlat) / (endPos - pxOffset);
    const mousePosAbs = { x: e.clientX, y: e.clientY };

    const targetPlace = videoPlaces.find(t => t.id === id);
    if (!targetPlace) {
      this.setState({
        mousePosAbs,
        mousePosFlat,
        mouseTime,
        targetInstance: null,
        targetPlace: null,
      });
      return;
    }

    const targetInstance = targetPlace.instances.find(
      i => i.start_seconds <= mouseTime && mouseTime < i.end_seconds
    );

    // console.log(targetInstance);

    this.setState({
      mousePosFlat,
      mousePosAbs,
      mouseTime,
      targetInstance,
      targetPlace,
    });
  };

  deletePlace = id => {
    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      const i = nextVideoPlaces.findIndex(t => t.id === id);
      nextVideoPlaces.splice(i, 1);
    });

    this.setState({ videoPlaces });
  };

  renamePlace = (id, name) => {
    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      const i = nextVideoPlaces.findIndex(t => t.id === id);
      nextVideoPlaces[i].project_location.name = name;
    });

    this.setState({ videoPlaces });
  };

  deleteInstance(id, instance) {
    console.group('deleteInstance()');
    console.log(instance);
    console.groupEnd();

    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      const ti = nextVideoPlaces.findIndex(t => t.id === id);
      const ii = nextVideoPlaces[ti].instances.findIndex(
        i => i.id === instance.id
      );
      nextVideoPlaces[ti].instances.splice(ii, 1);
    });

    const segments = recomputeSegments(videoPlaces, this.props.duration);
    this.setState({ videoPlaces, segments });
  }

  duplicateAsClip(instance) {
    console.group('duplicateAsClip()');
    console.log(instance);
    console.groupEnd();
  }

  expandInstance(id, instance) {
    console.group('expandInstance()');
    console.log(instance);
    console.groupEnd();

    const videoPlaces = produce(this.state.videoPlaces, nextVideoPlaces => {
      const ti = nextVideoPlaces.findIndex(t => t.id === id);
      const i = nextVideoPlaces[ti].instances.find(i => i.id === instance.id);
      i.start_seconds = 0;
      i.end_seconds = this.props.duration;
      nextVideoPlaces[ti].instances = [i];
    });

    const segments = recomputeSegments(videoPlaces, this.props.duration);
    this.setState({ videoPlaces, segments });
  }

  render() {
    const { currentTime, duration, data } = this.props;
    const { videoPlaces, playlist } = this.state;
    const { projectplaces } = data.project;

    return (
      <TableSection
        plain={videoPlaces ? videoPlaces.length > 0 : false}
        title="Places"
        actions={
          <>
            <Tooltip title={playlist ? 'Pause places' : 'Play places'}>
              <IconButton onClick={this.handlePlayPause}>
                {playlist ? (
                  <PauseIcon fontSize="small" />
                ) : (
                  <PlayArrowIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="New Place">
              <IconButton onClick={this.startNewPlace}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        }
      >
        {videoPlaces
          ? videoPlaces.map((place, i) => {
              const { project_location, instances } = place;
              const arr = [];

              Array.from(instances)
                .sort((p, q) => p.start_seconds - q.start_seconds)
                .map(instance => {
                  arr.push(instance.start_seconds);
                  arr.push(instance.end_seconds);
                  return null;
                });

              arr.sort((p, q) => p - q);

              const trackStyle = arr.reduce((acc, j, i) => {
                return [
                  ...acc,
                  {
                    backgroundColor:
                      i % 2 === 0 ? 'rgba(71, 123, 181, 0.4)' : 'transparent',
                  },
                ];
              }, []);

              // console.log(place.id, arr);

              return (
                <TableBlock
                  key={place.id}
                  plain={i < videoPlaces.length - 1}
                  leftColContent={
                    <PlaceControls
                      currentTime={currentTime}
                      deletePlace={() => this.deletePlace(place.id)}
                      isCreating={place.isCreating}
                      placeId={place.id}
                      placeName={project_location.name}
                      projectPlaces={projectplaces}
                      renamePlace={name => this.renamePlace(place.id, name)}
                      startNewInstance={() => this.startNewInstance(place.id)}
                      stopNewPlace={this.stopNewPlace}
                    />
                  }
                  rightColContent={
                    <>
                      <SliderWrapper
                        onMouseMove={e => this.leMenu(e, place.id)}
                        onMouseOver={e => this.leMenu(e, place.id)}
                      >
                        <MemoizedRange
                          key={place.id}
                          defaultValue={arr}
                          value={arr}
                          handle={this.handle}
                          max={duration}
                          min={0}
                          trackStyle={trackStyle}
                          pushable
                          onAfterChange={v => this.onAfterChange(v, place.id)}
                          onBeforeChange={v => this.onBeforeChange(v, place.id)}
                          onChange={v => this.onChange(v, place.id)}
                        />
                      </SliderWrapper>
                      <PlaceInstancePopover
                        id={place.id}
                        instance={this.state.targetInstance}
                        onExit={e => this.leMenuOff(e)}
                        place={this.state.targetPlace}
                        x={this.state.mousePosAbs.x}
                        y={this.state.mousePosAbs.y}
                        deleteInstance={i => this.deleteInstance(place.id, i)}
                        duplicateAsClip={this.duplicateAsClip}
                        expandInstance={i => this.expandInstance(place.id, i)}
                      />
                      <style scoped>
                        {'#instanceControlsPopover { pointer-events: none; }'}
                      </style>
                    </>
                  }
                />
              );
            })
          : null}
      </TableSection>
    );
  }
}

const recomputeSegments = (videoTags, duration) => {
  const instances = videoTags
    .reduce((acc, t) => [...acc, ...t.instances], [])
    .sort((j, i) => j.start_seconds - i.start_seconds);

  const events = [
    ...new Set(
      instances.reduce((acc, i) => [...acc, i.start_seconds, i.end_seconds], [
        0,
        duration,
      ])
    ),
  ].sort((j, i) => j - i);

  const segments = events
    .reduce(
      (acc, e, i) => {
        if (i === 0) return acc;
        return [...acc, events[i - 1] + (events[i] - events[i - 1]) / 2];
      },
      [0]
    )
    .reduce(
      (acc, s, i) =>
        !!instances.find(j => j.start_seconds <= s && s < j.end_seconds)
          ? [...acc, i]
          : acc,
      []
    )
    .map(i => [i, events[i - 1], events[i]]);

  return segments;
};

const MemoizedRange = React.memo(props => <Range {...props} />);

export default React.memo(props => <TimelinePlaces {...props} />);
