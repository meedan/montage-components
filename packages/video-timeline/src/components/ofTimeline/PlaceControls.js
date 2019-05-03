import React, { Component } from 'react';
import styled from 'styled-components';
import Flatted from 'flatted/esm';
import Popover from 'material-ui-popup-state/HoverPopover';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';

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

import PlaceMapPopover from './ofPlaces/PlaceMapPopover';

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

const ElSideControls = styled.div`
  visibility: hidden;
`;
const El = styled.div`
  cursor: pointer;
  width: 224px;
  ${({ hasAdornment }) =>
    hasAdornment
      ? `
    ${ElSideControls} {
      visibility: visible;
    }
  `
      : ''};
`;

function renderControlsPopover(
  onStartRename,
  onStartDelete,
  onStartReposition
) {
  return (
    <PopupState variant="popover" popupId="moreTagOptionsPopover">
      {popupState => (
        <div>
          <IconButton {...bindHover(popupState)} aria-label="Options…">
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
            <List dense>
              <ListItem button onClick={onStartRename}>
                <ListItemText>Rename</ListItemText>
              </ListItem>
              <ListItem button onClick={onStartReposition}>
                <ListItemText>Reposition</ListItemText>
              </ListItem>
              <ListItem button onClick={onStartDelete}>
                <ListItemText>Delete</ListItemText>
              </ListItem>
            </List>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}

class PlaceControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editStep: 0,
      isHovering: false,
      isProcessing: false,
      isDeleting: false,
      isCreating: false,
      placeName: this.props.placeName,
    };
    this.anchorRef = React.createRef();
  }

  componentDidMount() {
    return this.props.isCreating ? this.setState({ editStep: 1 }) : null;
  }

  startPlaceRename = () => {
    this.setState({ isHovering: false, editStep: 1 });
  };

  stopPlaceRename = () => {
    if (this.state.editStep === 1)
      this.setState({ editStep: 0, isHovering: false });
  };

  placeRename2 = (marker, placeName) => {
    console.log(marker, placeName);
    this.setState({ marker, placeName });
    // this.props.renamePlace(this.state.placeName, this.state.marker);
    // setTimeout(() => this.setState({ isProcessing: false }), 1000);

    // if (!window.BIGNONO) window.BIGNONO = {};
    // window.BIGNONO[this.props.placeId] = marker;
    let videoPlacesData = window.localStorage.getItem('videoPlacesData');
    if (videoPlacesData) {
      videoPlacesData = Flatted.parse(videoPlacesData);
    } else videoPlacesData = {};
    videoPlacesData[this.props.placeId] = marker;
    window.localStorage.setItem(
      'videoPlacesData',
      Flatted.stringify(videoPlacesData)
    );
  };

  startReposition = () => {
    this.setState({ isHovering: false, editStep: 2 });
  };

  endReposition = () => {
    this.setState({ editStep: 0, isHovering: false });
  };

  handlePlaceRename = name => {
    this.setState({ isProcessing: true, editStep: 0 });
    // TODO: wire place delete API calls
    console.group('handlePlaceRename()');
    console.log('name:', name);
    console.groupEnd();

    this.props.renamePlace(name, this.state.marker);

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  handlePlaceDelete = () => {
    this.setState({ isProcessing: true, isDeleting: false });
    // TODO: wire place delete API calls
    console.group('handlePlaceDelete()');
    console.log('placeId:', this.props.placeId);
    console.groupEnd();

    this.props.deletePlace();

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startNewInstance = () => {
    // TODO: wire create new instance API calls
    console.group('startNewInstance()');
    console.log('placeId:', this.props.placeId);
    console.log('start_seconds:', this.props.currentTime);
    console.groupEnd();

    this.props.startNewInstance();
  };

  render() {
    const { classes, isCreating, projectPlaces } = this.props;
    const { editStep, isDeleting, isHovering, isProcessing } = this.state;

    const readModeLabel = (
      <Grid
        alignItems="center"
        className={classes.Grid}
        container
        justify="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <Tooltip title={this.state.placeName} enterDelay={750}>
            <Typography
              className={classes.Typography}
              color={editStep === 2 ? 'primary' : 'textSecondary'}
              noWrap
              variant="body2"
            >
              {this.state.placeName}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item>
          <ElSideControls onClick={e => e.stopPropagation()}>
            {isProcessing ? (
              <CircularProgress
                size={18}
                className={classes.CircularProgress}
              />
            ) : (
              renderControlsPopover(
                this.startPlaceRename,
                this.handlePlaceDelete,
                this.startReposition
              )
            )}
          </ElSideControls>
        </Grid>
      </Grid>
    );

    const displayControls = () => {
      if (editStep === 0) {
        return readModeLabel;
      } else if (editStep === 1) {
        return (
          <EntityNameField
            name={this.props.clipName}
            onCancel={
              isCreating ? this.props.stopNewPlace : this.stopPlaceRename
            }
            onSubmit={
              isCreating ? this.startReposition : this.handlePlaceRename
            }
            suggestions={projectPlaces}
          />
        );
      } else if (editStep === 2) {
        return (
          <>
            {readModeLabel}
            <PlaceMapPopover
              anchorRef={this.anchorRef.current}
              data={[]}
              isCreating={this.props.isCreating}
              onClose={this.endReposition}
              onSave={marker => this.placeRename2(marker, this.state.placeName)}
              placeId={this.props.placeId}
              placeName={this.state.placeName}
              startPlaceRename={this.startPlaceRename}
              stopNewPlace={this.props.stopNewPlace}
            />
          </>
        );
      } else return null;
    };

    return (
      <El
        hasAdornment={editStep === 1 || isHovering || isProcessing}
        onClick={editStep === 0 ? this.startNewInstance : null}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
        ref={this.anchorRef}
      >
        {displayControls()}
        {isDeleting ? (
          <EntityDeleteModal
            name={this.state.placeName}
            onCancel={() => this.setState({ isDeleting: false })}
            onConfirm={this.handlePlaceDelete}
            title="Delete place"
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(PlaceControls);
