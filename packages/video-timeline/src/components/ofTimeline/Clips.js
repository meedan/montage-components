import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import Slider from 'rc-slider';
import produce from 'immer';
import Flatted from 'flatted/esm';
import { connect } from 'react-redux';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';

import CheckIcon from '@montage/ui/src/components/icons/CheckIcon';

import EntityControls from './EntityControls';
import EntityInstanceHandle from './EntityInstanceHandle';
import EntityInstancePopover from './EntityInstancePopover';
import SliderWrapper from './SliderWrapper';
import TableBlock from './TableBlock';
import TableSection from './TableSection';

import { play, pause, seekTo } from '../../reducers/player';

const Range = Slider.Range;

class TimelineClips extends Component {
  state = {
    choords: { x: 0, y: 0 },
    playlist: false,
    values: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { data, duration, skip } = props;
    let { videoClips } = data;

    if (skip) return null;

    const persisted = window.localStorage.getItem('videoClips');
    if (persisted) videoClips = Flatted.parse(persisted);

    if (state.videoClips && state.segments) return null;

    // merge overlapping clip instances
    videoClips.forEach(t => {
      t.isCreating = false;
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

    const segments = recomputeSegments(videoClips, duration);
    return { videoClips, segments };
  }

  componentDidMount = () => {
    this.props.registerDuplicateAsClip(this.duplicateAsClip);
  };

  duplicateAsClip = (tag, instance) => {
    console.log(tag, instance);

    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      let clip = this.state.videoClips.find(
        c => c.project_clip.name === tag.project_tag.name
      );

      if (!clip) {
        // this.startNewClip(null, tag.project_tag.name);
        clip = {
          id: Math.random()
            .toString(36)
            .substring(2),
          isCreating: false,
          instances: [
            {
              id: Math.random()
                .toString(36)
                .substring(2),
              start_seconds: instance.start_seconds,
              end_seconds: instance.end_seconds,
            },
          ],
          project_clip: {
            name: tag.project_tag.name,
          },
        };

        nextVideoClips.splice(0, 0, clip);
      } else {
        const j = {
          id: Math.random()
            .toString(36)
            .substring(2),
          start_seconds: instance.start_seconds,
          end_seconds: instance.end_seconds,
        };

        const overlappingInstance = clip.instances.find(
          i =>
            (j.start_seconds <= i.start_seconds &&
              i.start_seconds <= j.end_seconds) ||
            (j.start_seconds <= i.end_seconds &&
              i.end_seconds <= j.end_seconds) ||
            (i.start_seconds <= j.start_seconds &&
              j.start_seconds <= i.end_seconds) ||
            (i.start_seconds <= j.end_seconds && j.end_seconds <= i.end_seconds)
        );

        if (overlappingInstance) {
          overlappingInstance.start_seconds = Math.min(
            overlappingInstance.start_seconds,
            j.start_seconds
          );
          overlappingInstance.end_seconds = Math.max(
            overlappingInstance.end_seconds,
            j.end_seconds
          );
        } else {
          clip.instances.push(j);
        }
      }
    });

    const segments = recomputeSegments(videoClips, this.props.duration);
    this.setState({ videoClips, segments });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state)
      window.localStorage.setItem(
        'videoClips',
        Flatted.stringify(nextState.videoClips)
      );

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
          this.props.seekTo(nextSegment[1]);
        } else {
          if (this.props.playing) this.props.pause();
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
      if (!this.props.playing) this.props.play();
      this.setState({ playlist: true });
    } else {
      if (this.props.playing) this.props.pause();
      this.setState({ playlist: false });
    }
  };

  onAfterChange = (v, id) => {
    const { values } = this.state;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onAfterChange(val);
    }

    values[id] = v;
    this.setState({ values, isDragging: false });
  };

  onBeforeChange = (v, id) => {
    const { values } = this.state;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onBeforeChange(val);
    }

    values[id] = v;
    this.setState({
      values,
      targetInstance: null,
      targetClip: null,
      isDragging: true,
    });
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

    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      const ti = nextVideoClips.findIndex(t => t.id === id);
      const t = nextVideoClips[ti];

      const i = t.instances.sort((p, q) => p.start_seconds - q.start_seconds)[
        (j - (j % 2)) / 2
      ];

      if (i && j % 2 === 0) i.start_seconds = val;
      if (i && j % 2 === 1) i.end_seconds = val;
    });

    values[id] = v;
    const segments = recomputeSegments(videoClips, duration);
    this.setState({ videoClips, segments, values });
  };

  startNewInstance = id => {
    const { currentTime, duration } = this.props;

    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      const ti = nextVideoClips.findIndex(t => t.id === id);
      const t = nextVideoClips[ti];

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

    const segments = recomputeSegments(videoClips, duration);
    this.setState({ videoClips, segments });
  };

  startNewClip = () => {
    const { currentTime, duration } = this.props;
    const id = Math.random()
      .toString(36)
      .substring(2);

    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      nextVideoClips.splice(0, 0, {
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
        project_clip: {
          name: '',
        },
      });
    });

    const segments = recomputeSegments(videoClips, duration);
    this.setState({ videoClips, segments });
  };

  stopNewClip = () => {
    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      nextVideoClips.splice(0, 1);
    });

    this.setState({ videoClips });
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
        targetClip: null,
      });
    }
  };

  leMenu = (e, id) => {
    if (!e) {
      this.setState({
        targetInstance: null,
        targetTag: null,
      });
      return;
    }

    const { videoClips } = this.state;
    const { duration } = this.props;

    const rect = e.currentTarget.getBoundingClientRect();
    const mousePos = e.clientX - rect.left;
    const relativeMousePos = mousePos > 0 ? mousePos : 0;
    const mouseTime = (duration * relativeMousePos) / rect.width;

    const targetClip = videoClips.find(t => t.id === id);
    if (!targetClip) {
      this.setState({
        mousePos,
        mouseTime,
        targetInstance: null,
        targetClip: null,
      });
      return;
    }

    const pxs = rect.width / duration;

    // 4px handle -> time
    const handle = 4 / pxs;
    const targetInstance = targetClip.instances.find(
      i =>
        i.start_seconds - handle <= mouseTime &&
        mouseTime < i.end_seconds + handle
    );

    const instanceStartX = targetInstance
      ? pxs * targetInstance.start_seconds - 2
      : 0;
    const instanceEndX = targetInstance
      ? pxs * targetInstance.end_seconds + 2
      : 0;

    const isOverHandle =
      !targetClip.instances.find(
        i =>
          i.start_seconds + handle <= mouseTime &&
          mouseTime < i.end_seconds - handle
      ) &&
      !!targetClip.instances.find(
        i =>
          i.start_seconds - handle <= mouseTime &&
          mouseTime < i.end_seconds + handle
      );

    const handleOverStart = targetClip.instances.find(
      i => i.start_seconds - handle <= mouseTime && mouseTime < i.start_seconds
    );

    const handleOverEnd = targetClip.instances.find(
      i => i.end_seconds <= mouseTime && mouseTime < i.end_seconds + handle
    );

    // get x choords
    const getXChoord = () => {
      if (handleOverStart) {
        return instanceStartX;
      } else if (handleOverEnd) {
        return instanceEndX;
      } else {
        return instanceStartX + (instanceEndX - instanceStartX) / 2;
      }
    };

    this.setState({
      choords: {
        x: getXChoord() + rect.left,
        y: rect.top + rect.height,
      },
      isOverHandle,
      targetInstance,
      targetClip,
    });
  };

  deleteClip = id => {
    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      const i = nextVideoClips.findIndex(t => t.id === id);
      nextVideoClips.splice(i, 1);
    });

    this.setState({ videoClips });
  };

  renameClip = (id, name) => {
    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      const i = nextVideoClips.findIndex(t => t.id === id);
      nextVideoClips[i].project_clip.name = name;
    });

    this.setState({ videoClips });
  };

  deleteInstance(id) {
    const { targetInstance } = this.state;

    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      const ti = nextVideoClips.findIndex(t => t.id === id);
      const ii = nextVideoClips[ti].instances.findIndex(
        i => i.id === targetInstance.id
      );
      nextVideoClips[ti].instances.splice(ii, 1);
    });

    const segments = recomputeSegments(videoClips, this.props.duration);
    this.setState({
      videoClips,
      segments,
      targetInstance: null,
      targetTag: null,
    });
  }

  openInCheck = id => {
    const { targetInstance } = this.state;
    console.group('openInCheck');
    console.log('targetInstance', targetInstance);
    console.groupEnd();
    this.setState({
      targetInstance: null,
      targetTag: null,
    });
  };

  expandInstance(id) {
    const { targetInstance } = this.state;

    const videoClips = produce(this.state.videoClips, nextVideoClips => {
      const ti = nextVideoClips.findIndex(t => t.id === id);
      const i = nextVideoClips[ti].instances.find(
        i => i.id === targetInstance.id
      );
      i.start_seconds = 0;
      i.end_seconds = this.props.duration;
      nextVideoClips[ti].instances = [i];
    });

    const segments = recomputeSegments(videoClips, this.props.duration);
    this.setState({
      videoClips,
      segments,
      targetInstance: null,
      targetTag: null,
    });
  }

  render() {
    const { currentTime, duration, data } = this.props;
    const { videoClips, playlist } = this.state;
    const { projectclips } = data.project;

    return (
      <TableSection
        plain={videoClips ? videoClips.length > 0 : false}
        title="Clips"
        actions={
          <>
            <Tooltip title={playlist ? 'Pause clips' : 'Play clips'}>
              <IconButton onClick={this.handlePlayPause}>
                {playlist ? (
                  <PauseIcon fontSize="small" />
                ) : (
                  <PlayArrowIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="New Clip">
              <IconButton onClick={this.startNewClip}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        }
        onMouseLeave={this.leMenuOff}
      >
        {videoClips
          ? videoClips.map((clip, i) => {
              const { project_clip, instances } = clip;
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

              // console.log(clip.id, arr);

              return (
                <TableBlock
                  key={clip.id}
                  plain={i < videoClips.length - 1}
                  leftColContent={
                    <EntityControls
                      currentTime={currentTime}
                      deleteEntity={() => this.deleteClip(clip.id)}
                      entityId={clip.id}
                      entityName={project_clip.name}
                      isCreating={clip.isCreating}
                      startNewInstance={() => this.startNewInstance(clip.id)}
                      stopNewEntity={this.stopNewClip}
                      suggestions={projectclips}
                      updateEntity={name => this.renameClip(clip.id, name)}
                    />
                  }
                  rightColContent={
                    <>
                      <SliderWrapper
                        onMouseMove={
                          !this.state.isDragging
                            ? e => this.leMenu(e, clip.id)
                            : null
                        }
                        onMouseOver={
                          !this.state.isDragging
                            ? e => this.leMenu(e, clip.id)
                            : null
                        }
                      >
                        <MemoizedRange
                          key={clip.id}
                          defaultValue={arr}
                          value={arr}
                          handle={handleProps => (
                            <EntityInstanceHandle {...handleProps} />
                          )}
                          max={duration}
                          min={0}
                          trackStyle={trackStyle}
                          pushable
                          onAfterChange={v => this.onAfterChange(v, clip.id)}
                          onBeforeChange={v => this.onBeforeChange(v, clip.id)}
                          onChange={v => this.onChange(v, clip.id)}
                        />
                      </SliderWrapper>
                      <EntityInstancePopover
                        choords={{
                          x: this.state.choords.x,
                          y: this.state.choords.y,
                        }}
                        entity={this.state.targetClip}
                        entityId={clip.id}
                        instance={this.state.targetInstance}
                        isOverHandle={this.state.isOverHandle}
                        onDelete={() => this.deleteInstance(clip.id)}
                        onExit={this.leMenuOff}
                        onExtend={() => this.expandInstance(clip.id)}
                      >
                        <Tooltip title="Open in Check">
                          <IconButton onClick={() => this.openInCheck(clip.id)}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </EntityInstancePopover>
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

const recomputeSegments = (videoClips, duration) => {
  const instances = videoClips
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

// export default React.memo(props => <TimelineClips {...props} />);
export default connect(
  null,
  { play, pause, seekTo }
)(React.memo(props => <TimelineClips {...props} />));
