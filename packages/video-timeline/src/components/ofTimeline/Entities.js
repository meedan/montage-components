import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import Slider from 'rc-slider';
import produce from 'immer';
import Flatted from 'flatted/esm';
import { connect } from 'react-redux';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';

import { CheckIcon, CutIcon } from '@montage/ui/src/components';

import EntityControls from './ofEntities/EntityControls';
import EntityInstanceHandle from './ofEntities/EntityInstanceHandle';
import EntityInstancePopover from './ofEntities/EntityInstancePopover';
import EntitySliderWrapper from './ofEntities/EntitySliderWrapper';
import TableBlock from './TableBlock';
import TableSection from './TableSection';

import { play, pause, seekTo } from '../../reducers/player';

const Range = Slider.Range;
const FPS = 30;

function getName(entity, entityType) {
  return entity[`project_${entityType}`].name;
}

class Entities extends Component {
  state = {
    values: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { duration, skip, entityType, transport } = props;
    let { entities } = props;

    if (skip) return null;

    const playlist = transport === entityType;

    // const persisted = window.localStorage.getItem(entityType);
    // if (persisted) entities = Flatted.parse(persisted);

    // if (state.entities && state.segments) return { playlist };

    // merge overlapping tag instances
    // entities.forEach(e => {
    //   e.isCreating = false;
    //   e.instances = e.instances
    //     .sort((j, i) => j.start_seconds - i.start_seconds)
    //     .reduce((acc = [], i) => {
    //       const j = acc.pop();
    //
    //       if (j) {
    //         if (
    //           j.start_seconds <= i.start_seconds &&
    //           i.start_seconds < j.end_seconds
    //         ) {
    //           j.start_seconds = Math.min(j.start_seconds, i.start_seconds);
    //           j.end_seconds = Math.max(j.end_seconds, i.end_seconds);
    //           acc.push(j);
    //           return acc;
    //         }
    //
    //         acc.push(j);
    //       }
    //
    //       return [...acc, i];
    //     }, []);
    // });

    const segments = recomputeSegments(entities, duration);
    return { entities, segments, playlist };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (nextState !== this.state)
    //   window.localStorage.setItem(
    //     this.props.entityType,
    //     Flatted.stringify(nextState.entities)
    //   );

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
          this.props.seekTo({
            seekTo: nextSegment[1],
            transport: this.props.entityType,
          });
        } else {
          this.props.pause({ transport: null });
        }
      }
    }

    // if (
    //   nextProps.currentTime !== this.props.currentTime &&
    //   !this.state.playlist &&
    //   nextState === this.state
    // )
    //   return false;

    // TODO handle extenal video override, like end of video, buffering, etc

    return true;
  }

  componentDidMount = () => {
    if (this.props.registerDuplicateAsClip) {
      this.props.registerDuplicateAsClip(this.duplicateAsClipHook);
    }
  };

  duplicateAsClipHook = (entity, instance, entityType = 'tag') => {
    console.log(entity, instance);
    const entities = produce(this.state.entities, nextEntities => {
      let clip = this.state.entities.find(
        c => c.project_clip.name === getName(entity, entityType)
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
            name: getName(entity, entityType),
          },
        };

        nextEntities.splice(0, 0, clip);
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

    const segments = recomputeSegments(entities, this.props.duration);
    this.setState({ entities, segments });
  };

  handlePlay = () => {
    console.log(this.props.entityType);

    const start =
      this.state.segments && this.state.segments.length > 0
        ? this.state.segments[0][1]
        : 0;
    this.props.seekTo({ seekTo: start, transport: this.props.entityType });
    this.props.play({ transport: this.props.entityType });
  };

  handlePause = () => {
    this.props.pause({ transport: this.props.entityType });
  };

  onAfterChange = (v, id) => {
    // console.log('onAfterChange');
    const { values } = this.state;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      this.props.onAfterChange(val);
    }

    values[id] = v;
    this.setState({ values, isDragging: false });
  };

  onBeforeChange = (v, id) => {
    // console.log('onBeforeChange');
    const { values } = this.state;
    const p = values[id] || [];

    if (p.length === v.length) {
      const val = v.find((d, i) => p[i] !== d);
      this.props.onBeforeChange(val);
    }

    values[id] = v;
    this.setState({
      values,
      targetInstance: null,
      targetEntity: null,
      isDragging: true,
    });
  };

  onChange = (v, id) => {
    // console.log('onChange');
    const { values } = this.state;
    const { duration } = this.props;
    const p = values[id] || [];

    let val;
    if (p.length === v.length) {
      val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onChange(val);
    }

    const j = v.findIndex(d => d === val);

    const entities = produce(this.state.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === id);
      const t = nextEntities[ti];

      const i = t.instances.sort((p, q) => p.start_seconds - q.start_seconds)[
        (j - (j % 2)) / 2
      ];

      if (i && j % 2 === 0) i.start_seconds = val;
      if (i && j % 2 === 1) i.end_seconds = val;
    });

    values[id] = v;
    const segments = recomputeSegments(entities, duration);
    this.setState({ entities, segments, values });
  };

  moveHandle = (id, [startHandle, endHandle], unit = 0) => {
    const { targetInstance } = this.state;
    const { duration } = this.props;

    const entities = produce(this.state.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === id);
      const t = nextEntities[ti];

      const i = t.instances.find(i => i.id === targetInstance.id);

      if (startHandle) i.start_seconds += unit;
      if (endHandle) i.end_seconds += unit;
    });

    const segments = recomputeSegments(entities, duration);
    this.setState({ entities, segments });
  };

  startNewInstance = id => {
    const { currentTime, duration } = this.props;

    const entities = produce(this.state.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === id);
      const t = nextEntities[ti];

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

    const segments = recomputeSegments(entities, duration);
    this.setState({ entities, segments });
  };

  startNewEntity = () => {
    const { currentTime, entityType, duration } = this.props;
    const id = Math.random()
      .toString(36)
      .substring(2);

    const entityName = (function() {
      if (entityType === 'tag') {
        return { project_tag: { name: '' } };
      } else if (entityType === 'location') {
        return { project_location: { name: '' } };
      } else if (entityType === 'clip') {
        return { project_clip: { name: '' } };
      }
      return null;
    })();

    const entities = produce(this.state.entities, nextEntities => {
      nextEntities.splice(0, 0, {
        ...entityName,
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
      });
    });

    const segments = recomputeSegments(entities, duration);
    this.setState({ entities, segments });
  };

  stopNewEntity = () => {
    const entities = produce(this.state.entities, nextEntities => {
      nextEntities.splice(0, 1);
    });

    this.setState({ entities });
  };

  openInCheck = id => {
    const { targetInstance } = this.state;
    console.group('openInCheck');
    console.log('targetInstance', targetInstance);
    console.groupEnd();
    this.setState({
      targetInstance: null,
      targetEntity: null,
    });
  };

  detecInstancePopoverOff = ({ clientX, clientY, currentTarget }) => {
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
        targetEntity: null,
      });
    }
  };

  hideInstancePopover = () => {
    this.setState({
      targetInstance: null,
      targetEntity: null,
    });
  };

  showInstancePopover = (e, id) => {
    if (!e) {
      this.setState({
        targetInstance: null,
        targetEntity: null,
      });
      return;
    }

    const { entities } = this.state;
    const { duration } = this.props;

    const rect = e.currentTarget.getBoundingClientRect();

    const s2px = rect.width / duration;
    const px2s = duration / rect.width;

    const relativeMousePos = e.clientX - rect.left;
    const normalzdMousePos = relativeMousePos > 0 ? relativeMousePos : 0;
    const mouseTime = normalzdMousePos * px2s;

    const targetEntity = entities.find(t => t.id === id);
    if (!targetEntity) {
      this.setState({
        targetInstance: null,
        targetEntity: null,
      });
      return;
    }

    const handleTime = 4 * px2s;

    const targetInstance = targetEntity.instances.find(
      i =>
        mouseTime >= i.start_seconds - handleTime / 2 &&
        mouseTime < i.end_seconds
    );

    const instanceX1 = targetInstance ? targetInstance.start_seconds * s2px : 0;
    const instanceX2 = targetInstance ? targetInstance.end_seconds * s2px : 0;

    const isOverStartHandle = !!targetEntity.instances.find(
      i =>
        mouseTime >= i.start_seconds - handleTime &&
        mouseTime <= i.start_seconds + handleTime
    );

    const isOverEndHandle = !!targetEntity.instances.find(
      i =>
        mouseTime >= i.end_seconds - handleTime &&
        mouseTime <= i.end_seconds + handleTime
    );

    const x = (function() {
      if (isOverStartHandle) {
        return instanceX1;
      } else if (isOverEndHandle) {
        return instanceX2;
      } else {
        return instanceX1 + (instanceX2 - instanceX1) / 2;
      }
    })();

    this.setState({
      anchorPosition: {
        left: x + rect.left,
        top: rect.height + rect.top,
      },
      isOverHandle: isOverStartHandle || isOverEndHandle,
      isOverStartHandle,
      isOverEndHandle,
      targetInstance,
      targetEntity,
    });
  };

  deleteEntity = id => {
    const entities = produce(this.state.entities, nextEntities => {
      const i = nextEntities.findIndex(t => t.id === id);
      nextEntities.splice(i, 1);
    });

    this.setState({ entities });
  };

  updateEntity = (id, name) => {
    const { entityType } = this.props;

    const entities = produce(this.state.entities, nextEntities => {
      const i = nextEntities.findIndex(t => t.id === id);
      nextEntities[i][`project_${entityType}`].name = name;
      //
      // if (this.props.entityType === 'tag') {
      //   nextEntities[i].project_tag.name = name
      // } else if (this.props.entityType === 'place') {
      //   nextEntities[i].project_location.name = name
      // } else if (this.props.entityType === 'clip') {
      //   nextEntities[i].project_clip.name = name
      // }
    });

    this.setState({ entities });
  };

  deleteInstance(id) {
    const { targetInstance } = this.state;

    const entities = produce(this.state.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === id);
      const ii = nextEntities[ti].instances.findIndex(
        i => i.id === targetInstance.id
      );
      nextEntities[ti].instances.splice(ii, 1);
    });

    const segments = recomputeSegments(entities, this.props.duration);
    this.setState({
      entities,
      segments,
      targetInstance: null,
      targetEntity: null,
    });
  }

  duplicateAsClip = id => {
    const { targetInstance } = this.state;
    const entity = this.state.entities.find(t => t.id === id);
    this.props.duplicateAsClip(entity, targetInstance, this.props.entityType);
    this.setState({
      targetInstance: null,
      targetEntity: null,
    });
  };

  expandInstance(id) {
    const { targetInstance } = this.state;

    const entities = produce(this.state.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === id);
      const i = nextEntities[ti].instances.find(
        i => i.id === targetInstance.id
      );
      i.start_seconds = 0;
      i.end_seconds = this.props.duration;
      nextEntities[ti].instances = [i];
    });

    const segments = recomputeSegments(entities, this.props.duration);
    this.setState({
      entities,
      segments,
      targetInstance: null,
      targetEntity: null,
    });
  }

  render() {
    const { duration, suggestions, entityType } = this.props;
    const { entities, playlist } = this.state;

    return (
      <TableSection
        plain={entities ? entities.length > 0 : false}
        title={this.props.title}
        actions={
          <>
            <Tooltip title={playlist ? 'Pause all' : 'Play all'}>
              <IconButton
                onClick={() =>
                  playlist ? this.handlePause() : this.handlePlay()
                }
              >
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="New…">
              <IconButton onClick={this.startNewEntity}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        }
        onMouseLeave={this.hideInstancePopover}
      >
        {entities
          ? entities.map((entity, i) => {
              const { instances } = entity;

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
                  key={entity.id}
                  plain={i < entities.length - 1}
                  leftColContent={
                    <EntityControls
                      deleteEntity={() => this.deleteEntity(entity.id)}
                      entityId={entity.id}
                      entityName={getName(entity, entityType)}
                      entityType={entityType}
                      isCreating={entity.isCreating}
                      startNewInstance={() => this.startNewInstance(entity.id)}
                      stopNewEntity={this.stopNewEntity}
                      suggestions={suggestions}
                      updateEntity={name => this.updateEntity(entity.id, name)}
                    />
                  }
                  rightColContent={
                    <>
                      <EntitySliderWrapper
                        onMouseMove={
                          !this.state.isDragging
                            ? e => this.showInstancePopover(e, entity.id)
                            : this.detecInstancePopoverOff
                        }
                        onMouseOver={
                          !this.state.isDragging
                            ? e => this.showInstancePopover(e, entity.id)
                            : this.detecInstancePopoverOff
                        }
                      >
                        <MemoizedRange
                          defaultValue={arr}
                          handle={handleProps => (
                            <EntityInstanceHandle {...handleProps} />
                          )}
                          key={entity.id}
                          max={duration}
                          min={0}
                          onAfterChange={v => this.onAfterChange(v, entity.id)}
                          onBeforeChange={v =>
                            this.onBeforeChange(v, entity.id)
                          }
                          onChange={v => this.onChange(v, entity.id)}
                          pushable
                          trackStyle={trackStyle}
                          value={arr}
                        />
                      </EntitySliderWrapper>
                      <EntityInstancePopover
                        anchorPosition={this.state.anchorPosition}
                        handle={[
                          this.state.isOverStartHandle,
                          this.state.isOverEndHandle,
                        ]}
                        entity={this.state.targetEntity}
                        entityId={entity.id}
                        instance={this.state.targetInstance}
                        isOverHandle={this.state.isOverHandle}
                        onDelete={() => this.deleteInstance(entity.id)}
                        onExit={this.hideInstancePopover}
                        onExtend={() => this.expandInstance(entity.id)}
                        moveForward={h =>
                          this.moveHandle(entity.id, h, 1 / FPS)
                        }
                        moveBackward={h =>
                          this.moveHandle(entity.id, h, -1 / FPS)
                        }
                      >
                        {entityType !== 'clip' ? (
                          <Tooltip title="Copy to Clips">
                            <IconButton
                              onClick={() => this.duplicateAsClip(entity.id)}
                            >
                              <CutIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Open in Check">
                            <IconButton
                              onClick={() => this.openInCheck(entity.id)}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
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

const recomputeSegments = (entities, duration) => {
  const instances = entities
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

export default connect(
  null,
  { play, pause, seekTo }
)(Entities);
// )(React.memo(props => <Entities {...props} />));
