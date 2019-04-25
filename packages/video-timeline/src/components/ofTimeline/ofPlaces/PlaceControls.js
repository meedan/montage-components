import React, { Component } from 'react';
import styled from 'styled-components';
import Flatted from 'flatted/esm';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import PlaceControlsPopover from './PlaceControlsPopover';
import PlaceDeleteModal from './PlaceDeleteModal';
import PlaceNameField from './PlaceNameField';

import PlaceMapPopover from './PlaceMapPopover';

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

  placeRename = placeName => {
    this.setState({ placeName: placeName });
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
    window.localStorage.setItem('videoPlacesData', Flatted.stringify(videoPlacesData));
  };

  startReposition = () => {
    this.setState({ isHovering: false, editStep: 2 });
  };

  endReposition = () => {
    this.setState({ editStep: 0, isHovering: false });
  };

  handlePlaceRename = () => {
    this.setState({ isProcessing: true, editStep: 0 });
    // TODO: wire place delete API calls
    console.group('handlePlaceRename()');
    console.log('placeName:', this.state.placeName);
    console.groupEnd();

    this.props.renamePlace(this.state.placeName, this.state.marker);

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
    const { classes, projectPlaces } = this.props;
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
              <PlaceControlsPopover
                onStartRename={this.startPlaceRename}
                onStartDelete={() => this.setState({ isDeleting: true })}
                onStartReposition={this.startReposition}
              />
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
          <PlaceNameField
            handlePlaceRename={
              this.props.isCreating
                ? this.startReposition
                : this.handlePlaceRename
            }
            isCreating={this.props.isCreating}
            newPlaceName={this.state.placeName}
            oldPlaceName={this.props.placeName}
            placeRename={this.placeRename}
            projectPlaces={projectPlaces}
            stopNewPlace={this.props.stopNewPlace}
            stopPlaceRename={this.stopPlaceRename}
          />
        );
      } else if (editStep === 2) {
        return (
          <>
            {readModeLabel}
            <PlaceMapPopover
              placeId={this.props.placeId}
              anchorRef={this.anchorRef.current}
              data={[]}
              isCreating={this.props.isCreating}
              onClose={this.endReposition}
              startPlaceRename={this.startPlaceRename}
              stopNewPlace={this.props.stopNewPlace}
              onSave={marker => this.placeRename2(marker, this.state.placeName)}
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
          <PlaceDeleteModal
            handleClose={() => this.setState({ isDeleting: false })}
            handleRemove={this.handlePlaceDelete}
            placeName={this.state.placeName}
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(PlaceControls);
