import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';

import formatTime from './formatTime';
import TableBlock from './TableBlock';
import TableSection from './TableSection';
import TagControls from './ofTags/TagControls';

const Range = Slider.Range;
const Handle = Slider.Handle;

const SliderWrapper = styled.div`
  .rc-slider {
    height: 28px;
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

class TimelineTags extends Component {
  state = {
    playlist: false,
    values: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { data, duration } = props;
    const { videoTags } = data;

    if (state.videoTags && state.segments) return null;

    // merge overlapping tag instances
    videoTags.forEach(t => {
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

    // all tag instances sorted by start time
    const instances = videoTags
      .reduce((acc, t) => [...acc, ...t.instances], [])
      .sort((j, i) => j.start_seconds - i.start_seconds);

    // all start + end events
    const events = [
      ...new Set(
        instances.reduce((acc, i) => [...acc, i.start_seconds, i.end_seconds], [
          0,
          duration,
        ])
      ),
    ].sort((j, i) => j - i);
    // console.log(events);

    // all playable continuous segments
    const segments = events
      .reduce(
        (acc, e, i) => {
          if (i === 0) return acc;
          console.log(
            i,
            events[i],
            events[i - 1],
            events[i - 1] + (events[i] - events[i - 1]) / 2
          );
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
    // console.log(segments);

    return { videoTags, segments };
  }

  shouldComponentUpdate(nextProps, nextState) {
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
    // if (
    //   !nextProps.playing &&
    //   this.props.playing &&
    //   this.state.playlist &&
    //   nextState.playlist
    // ) {
    //   this.setState({ playlist: false });
    // }

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
    const { values, videoTags } = this.state;
    const { duration } = this.props;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onChange(val);
    }

    const i = videoTags.findIndex(t => t.id === id);

    videoTags[i].instances = v.reduce((acc, s, j, arr) => {
      if (j % 2 === 0) return acc;
      return [
        ...acc,
        {
          start_seconds: arr[j - 1],
          end_seconds: s,
        },
      ];
    }, []);

    // all tag instances sorted by start time
    const instances = videoTags
      .reduce((acc, t) => [...acc, ...t.instances], [])
      .sort((j, i) => j.start_seconds - i.start_seconds);

    // all start + end events
    const events = [
      ...new Set(
        instances.reduce((acc, i) => [...acc, i.start_seconds, i.end_seconds], [
          0,
          duration,
        ])
      ),
    ].sort((j, i) => j - i);

    // all playable continuous segments
    const segments = events
      .reduce(
        (acc, e, i) => {
          if (i === 0) return acc;
          console.log(
            i,
            events[i],
            events[i - 1],
            events[i - 1] + (events[i] - events[i - 1]) / 2
          );
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

    values[id] = v;
    this.setState({ values, videoTags, segments });
  };

  startNewInstance = id => {
    console.log(id);
    const { values, segments } = this.state;
    const { currentTime } = this.props;
    const p = values[id] || [];

    const segment = segments.find(
      ([i, s, e]) => s <= currentTime && currentTime < e
    );

    if (!segment) {
      const nextSegment = this.state.segments.find(([i, s]) => currentTime < s);

      if (nextSegment && currentTime + 5 > nextSegment[1]) {
        const nextIndex = p.findIndex(t => t === nextSegment[1]);
        p[nextIndex] = currentTime;
      } else {
        p.push(currentTime, currentTime + 5);
        p.sort((i, j) => i - j);
      }
    }

    this.onChange(p, id);
  };

  startNewTag = () => {
    const newTags = [
      {
        id: 'newTagTempId',
        isCreating: true,
        instances: [],
        project_tag: {
          name: '',
        },
      },
      ...this.state.videoTags,
    ];
    this.setState({ videoTags: newTags });
  };

  stopNewTag = () => {
    let newTags = this.state.videoTags;
    newTags.splice(0, 1);
    this.setState({ videoTags: newTags });
  };

  leMenu = (e, id) => {
    const pxOffset = 0;
    const { videoTags } = this.state;
    const { duration } = this.props;

    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = rect.left + pxOffset;
    const endPos = rect.width;
    const mousePos = e.clientX - startPos;
    const mousePosFlat = mousePos > 0 ? mousePos : 0;
    const mouseTime = (duration * mousePosFlat) / (endPos - pxOffset);

    // console.log(mouseTime);

    const targetTag = videoTags.find(t => t.id === id);
    if (!targetTag) {
      this.setState({ mousePosFlat, mouseTime, targetInstance: null, targetTag: null });
      return;
    }

    const targetInstance = targetTag.instances.find(
      i => i.start_seconds <= mouseTime && mouseTime < i.end_seconds
    );

    // console.log(targetInstance);

    this.setState({ mousePosFlat, mouseTime, targetInstance, targetTag });
  };

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
      >
        {videoTags
          ? videoTags.map((tag, i) => {
              const { project_tag, instances } = tag;
              const arr = [];

              instances.map(instance => {
                arr.push(instance.start_seconds);
                arr.push(instance.end_seconds);
                return null;
              });

              const trackStyle = arr.reduce((acc, j, i) => {
                return [
                  ...acc,
                  {
                    backgroundColor:
                      i % 2 === 0 ? 'rgba(71, 123, 181, 0.4)' : 'transparent',
                  },
                ];
              }, []);

              return (
                <TableBlock
                  key={tag.id}
                  plain={i < videoTags.length - 1}
                  leftColContent={
                    <TagControls
                      currentTime={currentTime}
                      isCreating={tag.isCreating}
                      projectTags={projecttags}
                      startNewInstance={() => this.startNewInstance(tag.id)}
                      stopNewTag={this.stopNewTag}
                      tagId={tag.id}
                      tagName={project_tag.name}
                    />
                  }
                  rightColContent={
                    <>
                      <SliderWrapper
                        onMouseMove={e => this.leMenu(e, tag.id)}
                        onMouseOver={e => this.leMenu(e, tag.id)}
                        onMouseOut={e => this.leMenu(e, null)}
                      >
                        <MemoizedRange
                          key={tag.id}
                          defaultValue={arr}
                          value={arr}
                          handle={this.handle}
                          max={duration}
                          min={0}
                          trackStyle={trackStyle}
                          pushable
                          onAfterChange={v => this.onAfterChange(v, tag.id)}
                          onBeforeChange={v => this.onBeforeChange(v, tag.id)}
                          onChange={v => this.onChange(v, tag.id)}
                        />
                      </SliderWrapper>
                      <InstanceControls
                        id={tag.id}
                        instance={this.state.targetInstance}
                        tag={this.state.targetTag}
                        x={this.state.mousePosFlat}
                      />
                      <style scoped>{'#instanceControlsPopover { pointer-events: none; }'}</style>
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

const InstanceControls = ({ id, x, el, instance, tag }) => {
  if (!instance || !tag || id !== tag.id) return null;
  return (
    <Popover
      id="instanceControlsPopover"
      open
      anchorPosition={{ left: 500, top: 500 }}
      anchorReference="anchorPosition"
      // anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      Tag {id} at {x}px [{instance.start_seconds} — {instance.end_seconds}]
    </Popover>
  );
};

const MemoizedRange = React.memo(props => <Range {...props} />);

export default React.memo(props => <TimelineTags {...props} />);
