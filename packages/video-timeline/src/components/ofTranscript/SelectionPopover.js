import React, { Component } from 'react';
import produce from 'immer';

import EntityControls from '../ofTimeline/ofEntities/EntityControls';
import CommentForm from '../ofTimeline/ofComments/CommentForm';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CommentIcon from '@material-ui/icons/Comment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LabelIcon from '@material-ui/icons/Label';
import Paper from '@material-ui/core/Paper';
import PlaceIcon from '@material-ui/icons/Place';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  Popper: {
    overflow: 'visible',
    zIndex: 100,
  },
  Grid: {
    padding: '4px',
  },
  EntityGrid: {
    // padding: '8px',
  },
  CommentGrid: {
    padding: '8px 12px',
  },
});

// function getName(entity, entityType) {
//   return entity[`project_${entityType}`].name;
// }

class SelectionPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreating: null,
      newInstanceId: null,
      newInstanceEntityName: null,
    };
  }

  updateEntity = (name, payload) => {
    const entityType = this.state.isCreating;
    const entitiesyKey = entityType === 'tag' ? 'videoTags' : 'videoPlaces';
    const entityName = entityType === 'tag' ? 'project_tag' : 'project_location';
    const currentEntitites = entityType === 'tag' ? this.props.videoTags : this.props.videoPlaces;

    const existingEntity = currentEntitites.find(e => e[entityName].name === name);

    const newInstanceId = Date.now();

    if (existingEntity) {
      const entities = produce(currentEntitites, nextEntities => {
        const entity = nextEntities.find(e => e.id === existingEntity.id);

        let { start, end } = this.props;
        const overlaps = entity.instances.filter(
          i => (i.start_seconds <= start && start < i.end_seconds) || (i.start_seconds < end && end <= i.end_seconds)
        );

        if (overlaps.length > 0) {
          console.log('overlapping instances adjusting from', start, end);
          start = Math.min(...[start, ...overlaps.map(({ start_seconds }) => start_seconds)]);
          end = Math.max(...[end, ...overlaps.map(({ end_seconds }) => end_seconds)]);
          console.log('to', start, end);

          entity.instances = entity.instances.reduce((acc, ii) => (overlaps.includes(ii) ? acc : [...acc, ii]), []);
        }

        entity.instances.push({
          id: newInstanceId,
          start_seconds: start,
          end_seconds: end,
        });

        this.setState({ newInstanceId, newInstanceEntityName: entity });
      });

      // this.props.update({ [entitiesyKey]: entities });
      console.log('TODO');
    } else {
      const entities = produce(currentEntitites, nextEntities => {
        nextEntities.splice(0, 0, {
          [entityName]: { name },
          id: newInstanceId,
          instances: [
            {
              id: newInstanceId,
              start_seconds: this.props.start,
              end_seconds: this.props.end,
            },
          ],
        });
      });

      this.setState({ newInstanceId, newInstanceEntityName: name });

      // this.props.update({ [entitiesyKey]: entities });
      console.log('TODO');
    }
  };

  render() {
    const { classes } = this.props;
    const { isCreating } = this.state;

    // console.group('SelectionPopover.js');
    // console.log('props:', this.props);
    // console.log('state:', this.state);
    // console.groupEnd();

    const ToolbarPopover = (
      <Popper
        anchorEl={this.props.isVisible}
        className={classes.Popper}
        disablePortal
        id={'ToolbarPopover'}
        open={!!this.props.isVisible}
        placement="top">
        <ClickAwayListener onClickAway={this.props.onClose}>
          <Paper elevation={3}>
            <Grid className={classes.Grid}>
              <Tooltip title="Add tag">
                <IconButton onClick={() => this.setState({ isCreating: 'tag' })}>
                  <LabelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add place">
                <IconButton onClick={() => this.setState({ isCreating: 'location' })}>
                  <PlaceIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add comment">
                <IconButton onClick={() => this.setState({ isCreating: 'comment' })}>
                  <CommentIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Paper>
        </ClickAwayListener>
      </Popper>
    );

    const NewEntityPopover = (
      <Popper
        anchorEl={this.props.isVisible}
        className={classes.Popper}
        disablePortal
        id={'NewEntityPopover'}
        open={!!this.props.isVisible}
        placement="top">
        <ClickAwayListener onClickAway={this.props.onClose}>
          <Paper elevation={3}>
            <Grid className={classes.EntityGrid}>
              <EntityControls
                // deleteEntity={() => this.deleteEntity(entity.id)}
                // entityId={entity.id}
                entityName={this.state.newInstanceEntityName}
                entityType={isCreating}
                isCreating={isCreating}
                // startNewInstance={() => this.startNewInstance(entity.id)}
                stopNewEntity={() => this.setState({ isCreating: null })}
                suggestions={isCreating === 'location' ? this.props.projectplaces : this.props.projecttags}
                updateEntity={this.updateEntity}
              />
            </Grid>
          </Paper>
        </ClickAwayListener>
      </Popper>
    );

    const NewThreadPopover = (
      <Popper
        anchorEl={this.props.isVisible}
        className={classes.Popper}
        disablePortal
        id={'NewThreadPopover'}
        open={!!this.props.isVisible}
        placement="top">
        <ClickAwayListener onClickAway={this.props.onClose}>
          <Paper elevation={3}>
            <Grid className={classes.CommentGrid}>
              <CommentForm
                isCreating
                onCancel={this.props.onClose}
                onSubmit={text => {
                  console.log('new comment thread starts with:', text);
                  this.props.onClose();
                }}
              />
            </Grid>
          </Paper>
        </ClickAwayListener>
      </Popper>
    );

    if (!isCreating) {
      return ToolbarPopover;
    } else {
      if (isCreating === 'location' || isCreating === 'tag') {
        return NewEntityPopover;
      } else if (isCreating === 'comment') {
        return NewThreadPopover;
      }
    }
  }
}

export default withStyles(styles)(SelectionPopover);
