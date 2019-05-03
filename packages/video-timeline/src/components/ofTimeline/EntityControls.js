import Popover from 'material-ui-popup-state/HoverPopover';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';
import React, { Component } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import EntityDeleteModal from './EntityDeleteModal';
import EntityNameField from './EntityNameField';

const styles = {
  Grid: {
    marginLeft: '12px',
    marginRight: '12px',
    width: '200px',
  },
  Typography: {
    maxWidth: '160px',
  },
  CircularProgress: {
    position: 'relative',
    left: '-8px',
  },
};

const ElementAdornment = styled.div`
  visibility: hidden;
`;
const Element = styled.div`
  cursor: pointer;
  width: 224px;
  ${({ hasAdornment }) =>
    hasAdornment
      ? `
    ${ElementAdornment} {
      visibility: visible;
    }
  `
      : ''};
`;

class NameControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: null,
    };
  }

  componentDidMount() {
    this.setState({ flow: this.props.isCreating ? 'edit' : null });
  }

  stopNewEntity = () => {
    this.props.stopNewEntity();
  };
  startRename = popupState => {
    this.setState({ flow: 'edit' });
    if (!popupState) return null;
    popupState.close();
  };
  stopRename = () => {
    this.setState({ flow: null });
  };
  startDelete = popupState => {
    this.setState({ flow: 'delete' });
    if (!popupState) return null;
    popupState.close();
  };
  stopDelete = () => {
    this.setState({ flow: null });
  };
  startHover = () => {
    const { flow } = this.state;
    if (flow) return null;
    this.setState({ flow: 'hover' });
  };
  stopHover = () => {
    const { flow } = this.state;
    if (flow !== 'hover') return null;
    this.setState({ flow: null });
  };

  onUpdate = name => {
    this.setState({ flow: 'processing' });
    this.props.updateEntity(name);
    setTimeout(() => this.setState({ flow: null }), 1000);
  };
  onDelete = name => {
    this.setState({ flow: 'processing' });
    setTimeout(() => {
      this.props.deleteEntity();
      this.setState({ flow: null });
    }, 1000);
  };

  render() {
    const {
      classes,
      entityName,
      isCreating,
      startNewInstance,
      stopNewEntity,
      suggestions,
    } = this.props;
    const { flow } = this.state;

    const allowNewInstance = flow !== 'edit' || flow !== 'processing';

    const read = (
      <Grid
        alignItems="center"
        className={classes.Grid}
        container
        justify="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <Tooltip title={entityName} enterDelay={750}>
            <Typography
              className={classes.Typography}
              color="textSecondary"
              noWrap
              variant="body2"
            >
              {entityName}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item>
          <ElementAdornment onClick={e => e.stopPropagation()}>
            {flow === 'processing' ? (
              <CircularProgress
                size={18}
                className={classes.CircularProgress}
              />
            ) : (
              <PopupState variant="popover" popupId="moreEntityControls">
                {popupState => (
                  <div>
                    <IconButton
                      {...bindHover(popupState)}
                      aria-label="Options…"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      disableRestoreFocus
                    >
                      <List dense onClick={popupState.close}>
                        <ListItem
                          button
                          onClick={() => this.startRename(popupState)}
                        >
                          <ListItemText>Rename</ListItemText>
                        </ListItem>
                        <ListItem
                          button
                          onClick={() => this.startDelete(popupState)}
                        >
                          <ListItemText>Delete</ListItemText>
                        </ListItem>
                      </List>
                    </Popover>
                  </div>
                )}
              </PopupState>
            )}
          </ElementAdornment>
        </Grid>
      </Grid>
    );
    const edit = (
      <EntityNameField
        name={entityName}
        onCancel={isCreating ? stopNewEntity : this.stopRename}
        onSubmit={this.onUpdate}
        suggestions={suggestions}
      />
    );

    return (
      <Element
        hasAdornment={flow && flow !== 'reposition' && flow !== 'delete'}
        onClick={allowNewInstance ? startNewInstance : null}
        onMouseEnter={this.startHover}
        onMouseLeave={this.stopHover}
      >
        {flow === 'edit' ? edit : read}
        {flow === 'delete' ? (
          <EntityDeleteModal
            name={entityName}
            onCancel={this.stopDelete}
            onConfirm={this.onDelete}
            title="Delete tag"
          />
        ) : null}
      </Element>
    );
  }
}

export default withStyles(styles)(NameControls);
