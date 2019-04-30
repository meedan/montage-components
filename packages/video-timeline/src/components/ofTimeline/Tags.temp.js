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

import ContentCutIcon from '@montage/ui/src/components/icons/ContentCutIcon';

import InstanceHandle from './InstanceHandle';
import InstancePopover from './InstancePopover';
import SliderWrapper from './SliderWrapper';
import TableBlock from './TableBlock';
import TableSection from './TableSection';
import TagControls from './ofTags/TagControls';

import { play, pause, seekTo } from '../../reducers/player';

const Range = Slider.Range;

class TimelineTags extends Component {
  state = {
    choords: { x: 0, y: 0 },
    clientX: 0,
    playlist: false,
    tag: { id: null },
    values: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { data, duration, skip } = props;
    let { videoTags } = data;

    if (skip) return null;

    const persisted = window.localStorage.getItem('videoTags');
    if (persisted) videoTags = Flatted.parse(persisted);

    if (state.videoTags && state.segments) return null;

    // merge overlapping tag instances
    videoTags.forEach(t => {
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

    const segments = recomputeSegments(videoTags, duration);
    return { videoTags, segments };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state)
      window.localStorage.setItem(
        'videoTags',
        Flatted.stringify(nextState.videoTags)
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
      instance: null,
      tag: null,
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

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const ti = nextVideoTags.findIndex(t => t.id === id);
      const t = nextVideoTags[ti];

      const i = t.instances.sort((p, q) => p.start_seconds - q.start_seconds)[
        (j - (j % 2)) / 2
      ];

      if (i && j % 2 === 0) i.start_seconds = val;
      if (i && j % 2 === 1) i.end_seconds = val;
    });

    values[id] = v;
    const segments = recomputeSegments(videoTags, duration);
    this.setState({ videoTags, segments, values });
  };

  startNewInstance = id => {
    const { currentTime, duration } = this.props;

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const ti = nextVideoTags.findIndex(t => t.id === id);
      const t = nextVideoTags[ti];

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

    const segments = recomputeSegments(videoTags, duration);
    this.setState({ videoTags, segments });
  };

  startNewTag = () => {
    const { currentTime, duration } = this.props;
    const id = Math.random()
      .toString(36)
      .substring(2);

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      nextVideoTags.splice(0, 0, {
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
        project_tag: {
          name: '',
        },
      });
    });

    const segments = recomputeSegments(videoTags, duration);
    this.setState({ videoTags, segments });
  };

  stopNewTag = () => {
    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      nextVideoTags.splice(0, 1);
    });

    this.setState({ videoTags });
  };

  hideInstancePopover = ({ clientX, clientY, currentTarget }) => {
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
        instance: null,
        tag: null,
      });
    }
  };

  checkForInstancePopover = (e, id) => {
    // check for the event
    if (!e) {
      this.setState({
        instance: null,
        tag: null,
      });
      return;
    }

    // name what’s needed
    const { videoTags, clientX } = this.state;
    const { duration } = this.props;
    const rect = e.currentTarget.getBoundingClientRect();
    const targetX = clientX - rect.left > 0 ? clientX - rect.left : 0;
    const mouseTime = (duration * targetX) / rect.width;
    const p2s = rect.width / duration;
    const s2p = duration / rect.width;

    // check for target tag
    const tag = videoTags.find(t => t.id === id);
    if (!tag) {
      this.setState({
        instance: null,
        tag: null,
      });
      return;
    }

    // get target instance
    let instance = tag.instances.find(
      i => i.start_seconds <= mouseTime && mouseTime <= i.end_seconds
    );
    const instanceStartX = instance ? p2s * instance.start_seconds - 2 : 0;
    const instanceEndX = instance ? p2s * instance.end_seconds + 2 : 0;

    // get anchor choords
    const isOnStartHandle =
      targetX - 2 >= instanceStartX && targetX <= instanceStartX;
    const isOnEndHandle =
      targetX + 2 >= instanceEndX && targetX <= instanceEndX;
    const getXChoord = () => {
      if (isOnStartHandle) {
        instance = true;
        return instanceStartX;
      } else if (isOnEndHandle) {
        instance = true;
        return instanceEndX;
      } else {
        return instanceStartX + (instanceEndX - instanceStartX) / 2;
      }
    };

    console.group('checkForInstancePopover()');
    // if (rect) console.log({ rect });
    console.log(instanceStartX, targetX);
    // console.log(instanceStartX, instanceStartX, clientX);
    // console.log(e);
    // console.log(clientX);
    // console.log(e.currentTarget);
    // console.log(e.currentTarget.getBoundingClientRect());
    // console.log(tag);
    // if (tag) console.log(mouseTime);
    // console.log({ clientX });
    // if (isOnStartHandle) console.log({ isOnStartHandle });
    // if (isOnEndHandle) console.log({ isOnEndHandle });
    // console.log(instance);
    console.groupEnd();

    this.setState({
      choords: {
        x: getXChoord() + rect.left,
        y: rect.top + rect.height,
      },
      isOnEndHandle,
      isOnStartHandle,
      instance,
      tag,
    });
  };

  deleteTag = id => {
    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const i = nextVideoTags.findIndex(t => t.id === id);
      nextVideoTags.splice(i, 1);
    });

    this.setState({ videoTags });
  };

  renameTag = (id, name) => {
    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const i = nextVideoTags.findIndex(t => t.id === id);
      nextVideoTags[i].project_tag.name = name;
    });

    this.setState({ videoTags });
  };

  deleteInstance(id, instance) {
    console.group('deleteInstance()');
    console.log(instance);
    console.groupEnd();

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const ti = nextVideoTags.findIndex(t => t.id === id);
      const ii = nextVideoTags[ti].instances.findIndex(
        i => i.id === instance.id
      );
      nextVideoTags[ti].instances.splice(ii, 1);
    });

    const segments = recomputeSegments(videoTags, this.props.duration);
    this.setState({ videoTags, segments });
  }

  duplicateAsClip = (id, instance) => {
    console.group('duplicateAsClip()');
    console.log(instance);
    console.groupEnd();

    const tag = this.state.videoTags.find(t => t.id === id);
    this.props.duplicateAsClip(tag, instance);
  };

  expandInstance(id, instance) {
    console.group('expandInstance()');
    console.log(instance);
    console.groupEnd();

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const ti = nextVideoTags.findIndex(t => t.id === id);
      const i = nextVideoTags[ti].instances.find(i => i.id === instance.id);
      i.start_seconds = 0;
      i.end_seconds = this.props.duration;
      nextVideoTags[ti].instances = [i];
    });

    const segments = recomputeSegments(videoTags, this.props.duration);
    this.setState({ videoTags, segments });
  }

  render() {
    const { currentTime, duration, data } = this.props;
    const { videoTags, playlist } = this.state;
    const { projecttags } = data.project;

    // console.group('Tags');
    // console.log(this.state.tag);
    // console.log(this.state.instance);
    // console.log(this.state.tag.id);
    // console.log(this.state.choords);
    // console.log(this.props.pxOffset);
    // console.log(this.props.timelineOffset);
    // console.groupEnd();

    return (
      <TableSection
        plain={videoTags ? videoTags.length > 0 : false}
        title="Tags"
        actions={
          <>
            <Tooltip title={playlist ? 'Pause tags' : 'Play tags'}>
              <IconButton onClick={this.handlePlayPause}>
                {playlist ? (
                  <PauseIcon fontSize="small" />
                ) : (
                  <PlayArrowIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="New Tag">
              <IconButton onClick={this.startNewTag}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        }
        onMouseLeave={this.hideInstancePopover}
      >
        {videoTags
          ? videoTags.map((tag, i) => {
              const { project_tag, instances } = tag;
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

              // console.log(tag.id, arr);

              return (
                <TableBlock
                  key={tag.id}
                  plain={i < videoTags.length - 1}
                  leftColContent={
                    <TagControls
                      currentTime={currentTime}
                      deleteTag={() => this.deleteTag(tag.id)}
                      isCreating={tag.isCreating}
                      projectTags={projecttags}
                      renameTag={name => this.renameTag(tag.id, name)}
                      startNewInstance={() => this.startNewInstance(tag.id)}
                      stopNewTag={this.stopNewTag}
                      tagId={tag.id}
                      tagName={project_tag.name}
                    />
                  }
                  rightColContent={
                    <>
                      <SliderWrapper
                        onMouseMove={
                          !this.state.isDragging
                            ? e =>
                                this.setState(
                                  { clientX: e.clientX },
                                  this.checkForInstancePopover(e, tag.id)
                                )
                            : null
                        }
                        onMouseOver={
                          !this.state.isDragging
                            ? e =>
                                this.setState(
                                  { clientX: e.clientX },
                                  this.checkForInstancePopover(e, tag.id)
                                )
                            : null
                        }
                      >
                        <MemoizedRange
                          key={tag.id}
                          defaultValue={arr}
                          value={arr}
                          handle={handleProps => (
                            <>
                              <InstanceHandle {...handleProps} />
                            </>
                          )}
                          max={duration}
                          min={0}
                          trackStyle={trackStyle}
                          pushable
                          onAfterChange={v => this.onAfterChange(v, tag.id)}
                          onBeforeChange={v => this.onBeforeChange(v, tag.id)}
                          onChange={v => this.onChange(v, tag.id)}
                        />
                      </SliderWrapper>
                      <InstancePopover
                        choords={{
                          x: this.state.choords.x,
                          y: this.state.choords.y,
                        }}
                        instance={this.state.instance}
                        isOnEndHandle={this.state.isOnEndHandle}
                        isOnStartHandle={this.state.isOnStartHandle}
                        mouseTime={this.state.mouseTime}
                        onDelete={i => this.deleteInstance(tag.id, i)}
                        onExit={this.hideInstancePopover}
                        onExtend={i => this.expandInstance(tag.id, i)}
                        tag={this.state.tag}
                        tagId={tag.id}
                      >
                        <Tooltip title="Copy to Clips">
                          <IconButton
                            onClick={i => this.duplicateAsClip(tag.id, i)}
                          >
                            <ContentCutIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InstancePopover>
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

// export default React.memo(props => <TimelineTags {...props} />);
export default connect(
  null,
  { play, pause, seekTo }
)(React.memo(props => <TimelineTags {...props} />));
