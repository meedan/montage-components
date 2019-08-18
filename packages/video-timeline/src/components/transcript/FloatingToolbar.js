import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';

import EntityControls from '../ofTimeline/ofEntities/EntityControls';

class FloatingToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Popover
        id={'meh'}
        open={!!this.props.isVisible}
        anchorEl={this.props.isVisible}
        onClose={() => this.setState({ anchor: null })}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <EntityControls
        // deleteEntity={() => this.deleteEntity(entity.id)}
        // entityId={entity.id}
        // entityName={getName(entity, entityType)}
        // entityType={entityType}
        // isCreating={entity.isCreating}
        // startNewInstance={() => this.startNewInstance(entity.id)}
        // stopNewEntity={this.stopNewEntity}
        // suggestions={suggestions}
        // updateEntity={(name, payload) => this.updateEntity(entity.id, name, payload)}
        />
      </Popover>
    );
  }
}

export default FloatingToolbar;
