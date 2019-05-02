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

import EntityInstanceHandle from './EntityInstanceHandle';
import EntityInstancePopover from './EntityInstancePopover';
import SliderWrapper from './SliderWrapper';
import TableBlock from './TableBlock';
import TableSection from './TableSection';
import TagControls from './ofTags/TagControls';

import { play, pause, seekTo } from '../../reducers/player';

const Range = Slider.Range;

class TimelineTags extends Component {
  state = {
    choords: { x: 0, y: 0 },
    playlist: false,
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
      targetInstance: null,
      targetTag: null,
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
        targetTag: null,
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

    const { videoTags } = this.state;
    const { duration } = this.props;

    const rect = e.currentTarget.getBoundingClientRect();
    const mousePos = e.clientX - rect.left;
    const relativeMousePos = mousePos > 0 ? mousePos : 0;
    const mouseTime = (duration * relativeMousePos) / rect.width;

    const targetTag = videoTags.find(t => t.id === id);
    if (!targetTag) {
      this.setState({
        mousePos,
        mouseTime,
        targetInstance: null,
        targetTag: null,
      });
      return;
    }

    const pxs = rect.width / duration;

    // 4px handle -> time
    const handle = 4 / pxs;
    const targetInstance = targetTag.instances.find(
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
      !targetTag.instances.find(
        i =>
          i.start_seconds + handle <= mouseTime &&
          mouseTime < i.end_seconds - handle
      ) &&
      !!targetTag.instances.find(
        i =>
          i.start_seconds - handle <= mouseTime &&
          mouseTime < i.end_seconds + handle
      );

    const handleOverStart = targetTag.instances.find(
      i => i.start_seconds - handle <= mouseTime && mouseTime < i.start_seconds
    );

    const handleOverEnd = targetTag.instances.find(
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
      targetTag,
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

  deleteInstance(id) {
    const { targetInstance } = this.state;

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const ti = nextVideoTags.findIndex(t => t.id === id);
      const ii = nextVideoTags[ti].instances.findIndex(
        i => i.id === targetInstance.id
      );
      nextVideoTags[ti].instances.splice(ii, 1);
    });

    const segments = recomputeSegments(videoTags, this.props.duration);
    this.setState({
      videoTags,
      segments,
      targetInstance: null,
      targetTag: null,
    });
  }

  duplicateAsClip = id => {
    const { targetInstance } = this.state;

    const tag = this.state.videoTags.find(t => t.id === id);
    this.props.duplicateAsClip(tag, targetInstance);

    this.setState({
      targetInstance: null,
      targetTag: null,
    });
  };

  expandInstance(id) {
    const { targetInstance } = this.state;

    const videoTags = produce(this.state.videoTags, nextVideoTags => {
      const ti = nextVideoTags.findIndex(t => t.id === id);
      const i = nextVideoTags[ti].instances.find(
        i => i.id === targetInstance.id
      );
      i.start_seconds = 0;
      i.end_seconds = this.props.duration;
      nextVideoTags[ti].instances = [i];
    });

    const segments = recomputeSegments(videoTags, this.props.duration);
    this.setState({
      videoTags,
      segments,
      targetInstance: null,
      targetTag: null,
    });
  }

  render() {
    const { currentTime, duration, data } = this.props;
    const { videoTags, playlist } = this.state;
    const { projecttags } = data.project;

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
        onMouseLeave={this.leMenuOff}
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
                            ? e => this.leMenu(e, tag.id)
                            : this.leMenuOff
                        }
                        onMouseOver={
                          !this.state.isDragging
                            ? e => this.leMenu(e, tag.id)
                            : this.leMenuOff
                        }
                      >
                        <MemoizedRange
                          defaultValue={arr}
                          handle={handleProps => (
                            <EntityInstanceHandle {...handleProps} />
                          )}
                          key={tag.id}
                          max={duration}
                          min={0}
                          onAfterChange={v => this.onAfterChange(v, tag.id)}
                          onBeforeChange={v => this.onBeforeChange(v, tag.id)}
                          onChange={v => this.onChange(v, tag.id)}
                          pushable
                          trackStyle={trackStyle}
                          value={arr}
                        />
                      </SliderWrapper>
                      <EntityInstancePopover
                        choords={{
                          x: this.state.choords.x,
                          y: this.state.choords.y,
                        }}
                        entity={this.state.targetTag}
                        entityId={tag.id}
                        instance={this.state.targetInstance}
                        isOverHandle={this.state.isOverHandle}
                        onDelete={() => this.deleteInstance(tag.id)}
                        onExit={this.leMenuOff}
                        onExtend={() => this.expandInstance(tag.id)}
                      >
                        <Tooltip title="Copy to Clips">
                          <IconButton
                            onClick={() => this.duplicateAsClip(tag.id)}
                          >
                            <ContentCutIcon fontSize="small" />
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
