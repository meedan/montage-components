/** @format */

import React, { Component } from 'react';
import produce from 'immer';
import { connect } from 'react-redux';

import EntityControls from '../ofTimeline/ofEntities/EntityControls';
import CommentForm from '../ofTimeline/ofComments/CommentForm';

import CommentIcon from '@material-ui/icons/Comment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LabelIcon from '@material-ui/icons/Label';
import PlaceIcon from '@material-ui/icons/Place';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { update } from '../../reducers/data';

const styles = theme => ({
  Popover: {
    overflow: 'visible',
    marginTop: '-20px',
  },
  EntityGrid: {
    margin: '8px',
  },
  CommentGrid: {
    margin: '16px',
  },
});

class FloatingToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreating: null,
    };
  }

  updateEntity = (name, payload) => {
    const entityType = this.state.isCreating;
    const entitiesyKey = entityType === 'tag' ? 'videoTags' : 'videoPlaces';
    const entityName = entityType === 'tag' ? 'project_tag' : 'project_location';
    const currentEntitites = entityType === 'tag' ? this.props.videoTags : this.props.videoPlaces;

    const existingEntity = currentEntitites.find(e => e[entityName].name === name);

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
          id: Math.random()
            .toString(36)
            .substring(2),
          start_seconds: start,
          end_seconds: end,
        });
      });

      this.props.update({ [entitiesyKey]: entities });
    } else {
      const entities = produce(currentEntitites, nextEntities => {
        nextEntities.splice(0, 0, {
          [entityName]: { name },
          id: Math.random()
            .toString(36)
            .substring(2),
          instances: [
            {
              id: Math.random()
                .toString(36)
                .substring(2),
              start_seconds: this.props.start,
              end_seconds: this.props.end,
            },
          ],
        });
      });

      this.props.update({ [entitiesyKey]: entities });
    }
  };

  render() {
    const { classes } = this.props;
    const { isCreating } = this.state;

    const ToolbarPopover = (
      <Popover
        id={'ToolbarPopover'}
        open={!!this.props.isVisible}
        anchorEl={this.props.isVisible}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.Popover,
        }}>
        <Grid className={classes.EntityGrid}>
          <Tooltip title="Add tag">
            <IconButton onClick={() => this.setState({ isCreating: 'tag' })}>
              <LabelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add place">
            <IconButton onClick={() => this.setState({ isCreating: 'place' })}>
              <PlaceIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add comment">
            <IconButton onClick={() => this.setState({ isCreating: 'comment' })}>
              <CommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Popover>
    );

    const NewEntityPopover = (
      <Popover
        id={'NewEntityPopover'}
        open={!!this.props.isVisible}
        anchorEl={this.props.isVisible}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.Popover,
        }}>
        <Grid className={classes.EntityGrid}>
          <EntityControls
            // deleteEntity={() => this.deleteEntity(entity.id)}
            // entityId={entity.id}
            // entityName={getName(entity, entityType)}
            entityType={isCreating}
            isCreating={true}
            // startNewInstance={() => this.startNewInstance(entity.id)}
            stopNewEntity={() => this.setState({ isCreating: null })}
            suggestions={isCreating === 'place' ? this.props.projectplaces : this.props.projecttags}
            updateEntity={this.updateEntity}
          />
        </Grid>
      </Popover>
    );

    const NewThreadPopover = (
      <Popover
        id={'NewThreadPopover'}
        open={!!this.props.isVisible}
        anchorEl={this.props.isVisible}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.Popover,
        }}>
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
      </Popover>
    );

    if (!isCreating) {
      return ToolbarPopover;
    } else {
      if (isCreating === 'place' || isCreating === 'tag') {
        return NewEntityPopover;
      } else if (isCreating === 'comment') {
        return NewThreadPopover;
      }
    }
  }
}

export default connect(
  null,
  { update }
)(withStyles(styles)(FloatingToolbar));
