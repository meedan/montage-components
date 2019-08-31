import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';

import EntityControls from '../ofTimeline/ofEntities/EntityControls';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import LabelIcon from '@material-ui/icons/Label';
import CommentIcon from '@material-ui/icons/Comment';
import { withStyles } from '@material-ui/core/styles';

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
            <Tooltip title='Add tag'>
              <IconButton onClick={() => this.setState({ isCreating: 'tag' })}>
                <LabelIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Add place'>
              <IconButton
                onClick={() => this.setState({ isCreating: 'place' })}
              >
                <PlaceIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Add comment'>
              <IconButton
                onClick={() => this.setState({ isCreating: 'comment' })}
              >
                <CommentIcon fontSize='small' />
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
            suggestions={
              isCreating === 'place'
                ? this.props.projectplaces
                : this.props.projecttags
            }
            updateEntity={(name, payload) => console.log(name, payload)}
          />
        ) : null}
        {isCreating === 'comment' ? <>Nu comment thread</> : null}
      </Popover>
    );
  }
}

export default withStyles(styles)(FloatingToolbar);
