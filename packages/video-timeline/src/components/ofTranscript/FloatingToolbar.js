import React, { Component } from 'react';
import produce from 'immer';
import { connect } from 'react-redux';

import Popover from '@material-ui/core/Popover';

import EntityControls from '../ofTimeline/ofEntities/EntityControls';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import LabelIcon from '@material-ui/icons/Label';
import CommentIcon from '@material-ui/icons/Comment';
import { withStyles } from '@material-ui/core/styles';

import { update } from '../../reducers/data';

const styles = theme => ({
  Popover: {
    overflow: 'visible',
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

    const entity = (entityType === 'tag' ? this.props.videoTags : this.props.videoPlaces).find(
      e => e[entityType === 'tag' ? 'project_tag' : 'project_location'].name === name
    );

    if (entity) {
      const entities = produce(entityType === 'tag' ? this.props.videoTags : this.props.videoPlaces, nextEntities => {
        const ti = nextEntities.findIndex(t => t.id === entity.id);
        const t = nextEntities[ti];

        let { start, end } = this.props;
        const i = t.instances.filter(
          i => (i.start_seconds <= start && start < i.end_seconds) || (i.start_seconds < end && end <= i.end_seconds)
        );

        if (i.length > 0) {
          console.log('overlapping instances adjusting from', start, end);
          start = Math.min(...[start, ...i.map(({ start_seconds }) => start_seconds)]);
          end = Math.max(...[end, ...i.map(({ end_seconds }) => end_seconds)]);
          console.log('to', start, end);

          t.instances = t.instances.reduce((acc, ii) => (i.includes(ii) ? acc : [...acc, ii]), []);
        }
        // } else {
        t.instances.push({
          id: Math.random()
            .toString(36)
            .substring(2),
          start_seconds: start,
          end_seconds: end,
        });
        // }
      });

      this.props.update({ [entitiesyKey]: entities });
    } else {
      const entities = produce(entityType === 'tag' ? this.props.videoTags : this.props.videoPlaces, nextEntities => {
        nextEntities.splice(0, 0, {
          [entityType === 'tag' ? 'project_tag' : 'project_location']: { name },
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

    console.log(this.props);

    return (
      <Popover
        id={'meh'}
        open={!!this.props.isVisible}
        anchorEl={this.props.isVisible}
        onClose={this.props.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.Popover,
        }}
      >
        {!isCreating ? (
          <>
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
          </>
        ) : null}
        {isCreating === 'place' || isCreating === 'tag' ? (
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
        ) : null}
        {isCreating === 'comment' ? <>Nu comment thread</> : null}
      </Popover>
    );
  }
}

// export default withStyles(styles)(FloatingToolbar);
export default connect(
  null,
  { update }
)(withStyles(styles)(FloatingToolbar));
