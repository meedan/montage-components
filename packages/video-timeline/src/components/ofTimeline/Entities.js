import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import produce from 'immer';
import { connect } from 'react-redux';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';

import { RangeSlider } from '@montage/ui';

import EntityControls from './ofEntities/EntityControls';
import TableBlock from './TableBlock';
import TableSection from './TableSection';

import { play, pause, seekTo } from '../../reducers/player';
import { update } from '../../reducers/data';

// const FPS = 30;

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

    // TODO: move this upstream
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
    return { segments, playlist };
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
    const entities = produce(this.props.entities, nextEntities => {
      let clip = this.props.entities.find(
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

    this.props.update({ [this.props.entitiesyKey]: entities });
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
    const { values } = this.state;
    const p = values[id] || [];

    let val;
    if (p.length === v.length) {
      val = v.find((d, i) => p[i] !== d);
      if (val) this.props.onChange(val);
    }

    const j = v.findIndex(d => d === val);

    const entities = produce(this.props.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === id);
      const t = nextEntities[ti];

      const i = t.instances.sort((p, q) => p.start_seconds - q.start_seconds)[
        (j - (j % 2)) / 2
      ];

      if (i && j % 2 === 0) i.start_seconds = val;
      if (i && j % 2 === 1) i.end_seconds = val;
    });

    values[id] = v;
    this.setState({ values });

    this.props.update({ [this.props.entitiesyKey]: entities });
  };

  // moveHandle = (id, [startHandle, endHandle], unit = 0) => {
  //   const { targetInstance } = this.state;
  //
  //   const entities = produce(this.props.entities, nextEntities => {
  //     const ti = nextEntities.findIndex(t => t.id === id);
  //     const t = nextEntities[ti];
  //
  //     const i = t.instances.find(i => i.id === targetInstance.id);
  //
  //     if (startHandle) i.start_seconds += unit;
  //     if (endHandle) i.end_seconds += unit;
  //   });
  //
  //   this.props.update({ [this.props.entitiesyKey]: entities });
  // };

  startNewInstance = id => {
    const { currentTime } = this.props;

    const entities = produce(this.props.entities, nextEntities => {
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

    this.props.update({ [this.props.entitiesyKey]: entities });
  };

  startNewEntity = () => {
    const { currentTime, entityType } = this.props;
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

    const entities = produce(this.props.entities, nextEntities => {
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

    this.props.update({ [this.props.entitiesyKey]: entities });
  };

  stopNewEntity = () => {
    const entities = produce(this.props.entities, nextEntities => {
      nextEntities.splice(0, 1);
    });

    this.props.update({ [this.props.entitiesyKey]: entities });
  };

  checkInstance = instanceId => {
    console.log('checkInstance', instanceId);
  };

  deleteEntity = id => {
    const entities = produce(this.props.entities, nextEntities => {
      const i = nextEntities.findIndex(t => t.id === id);
      nextEntities.splice(i, 1);
    });

    this.props.update({ [this.props.entitiesyKey]: entities });
  };

  updateEntity = (id, name) => {
    const { entityType } = this.props;

    const entities = produce(this.props.entities, nextEntities => {
      const i = nextEntities.findIndex(t => t.id === id);
      nextEntities[i][`project_${entityType}`].name = name;
      delete nextEntities[i].isCreating;
    });

    this.props.update({ [this.props.entitiesyKey]: entities });
  };

  deleteInstance(entityId, instanceId) {
    // const { targetInstance } = this.state;

    const entities = produce(this.props.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === entityId);
      // const ii = nextEntities[ti].instances.findIndex(
      //   i => i.id === targetInstance.id
      // );
      const ii = nextEntities[ti].instances.findIndex(i => i.id === instanceId);

      nextEntities[ti].instances.splice(ii, 1);
    });

    this.setState({
      targetInstance: null,
      targetEntity: null,
    });

    this.props.update({ [this.props.entitiesyKey]: entities });
  }

  duplicateAsClip = id => {
    const { targetInstance } = this.state;
    const entity = this.props.entities.find(t => t.id === id);
    this.props.duplicateAsClip(entity, targetInstance, this.props.entityType);
    this.setState({
      targetInstance: null,
      targetEntity: null,
    });
  };

  extendInstance(entityId, instanceId) {
    const entities = produce(this.props.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === entityId);
      const i = nextEntities[ti].instances.find(i => i.id === instanceId);
      i.start_seconds = 0;
      i.end_seconds = this.props.duration;
      nextEntities[ti].instances = [i];
    });
    this.props.update({ [this.props.entitiesyKey]: entities });
  }

  updateInstance(entityId, instanceId, { start_seconds, end_seconds }) {
    const entities = produce(this.props.entities, nextEntities => {
      const ti = nextEntities.findIndex(t => t.id === entityId);
      const i = nextEntities[ti].instances.find(i => i.id === instanceId);
      i.start_seconds = start_seconds;
      i.end_seconds = end_seconds;
    });
    this.props.update({ [this.props.entitiesyKey]: entities });
  }

  render() {
    const { entities, duration, suggestions, entityType } = this.props;
    const { playlist } = this.state;

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
                      isCreating={
                        entity.isCreating || entity.isCreating !== undefined
                      }
                      startNewInstance={() => this.startNewInstance(entity.id)}
                      stopNewEntity={this.stopNewEntity}
                      suggestions={suggestions}
                      updateEntity={name => this.updateEntity(entity.id, name)}
                    />
                  }
                  rightColContent={
                    <RangeSlider
                      clipInstance={
                        entityType !== 'clip'
                          ? instanceId =>
                              console.log('clipInstance: ', instanceId)
                          : null
                      }
                      checkInstance={
                        entityType === 'clip'
                          ? instanceId => this.checkInstance(instanceId)
                          : null
                      }
                      extendInstance={instanceId =>
                        this.extendInstance(entity.id, instanceId)
                      }
                      duration={duration}
                      instances={instances}
                      updateInstance={(instanceId, payload) =>
                        this.updateInstance(entity.id, instanceId, payload)
                      }
                      deleteInstance={instanceId =>
                        this.deleteInstance(entity.id, instanceId)
                      }
                    />
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
  if (!entities) return [];

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

export default connect(
  null,
  { play, pause, seekTo, update }
)(Entities);
