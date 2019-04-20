import React, { Component } from 'react';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PlaceControlsPopover from './PlaceControlsPopover';
import PlaceDeleteModal from './PlaceDeleteModal';
import PlaceNameField from './PlaceNameField';

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
      isEditing: false,
      isHovering: false,
      isProcessing: false,
      isDeleting: false,
      isCreating: false,
      placeName: this.props.placeName,
    };
  }

  componentDidMount() {
    this.setState({ isEditing: this.props.isCreating });
  }

  startPlaceRename = () => {
    this.setState({ isHovering: false, isEditing: true });
  };

  stopPlaceRename = () => {
    if (this.state.isEditing)
      this.setState({ isEditing: false, isHovering: false });
  };

  placeRename = placeName => {
    this.setState({ placeName: placeName });
  };

  handlePlaceRename = () => {
    this.setState({ isProcessing: true, isEditing: false });
    // TODO: wire place delete API calls
    console.group('handlePlaceRename()');
    console.log('placeName:', this.state.placeName);
    console.groupEnd();

    this.props.renamePlace(this.state.placeName);

    setTimeout(() => this.setState({ isProcessing: false }), 1000); // TODO: fix this faked error/success event
  };

  startPlaceDelete = () => {
    this.setState({ isDeleting: true });
  };

  stopPlaceDelete = () => {
    this.setState({ isDeleting: false });
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
    const { isDeleting, isEditing, isHovering, isProcessing } = this.state;

    const readMode = (
      <Grid
        alignItems="center"
        className={classes.Grid}
        container
        justify="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <Typography
            className={classes.Typography}
            color="textSecondary"
            noWrap
            variant="body2"
          >
            {this.state.placeName}
          </Typography>
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
                onStartDelete={this.startPlaceDelete}
              />
            )}
          </ElSideControls>
        </Grid>
      </Grid>
    );

    // const editMode = (
    //   <ClickAwayListener onClickAway={this.stopPlaceRename}>
    //     <TextField
    //       autoComplete="false"
    //       autoFocus
    //       className={classes.TextField}
    //       defaultValue={this.state.placeName}
    //       fullWidth
    //       onChange={e => this.setState({ placeName: e.currentTarget.value })}
    //       onKeyPress={e => {
    //         if (e.key === 'Enter') {
    //           e.preventDefault();
    //           this.handlePlaceRename();
    //         }
    //       }}
    //       required
    //       InputProps={{
    //         classes: {
    //           root: classes.InputRoot,
    //         },
    //         endAdornment: this.props.isCreating ? (
    //           <InputAdornment position="end">
    //             <IconButton onClick={this.props.stopNewPlace}>
    //               <CloseIcon fontSize="small" />
    //             </IconButton>
    //           </InputAdornment>
    //         ) : null,
    //       }}
    //     />
    //   </ClickAwayListener>
    // );

    return (
      <El
        hasAdornment={isEditing || isHovering || isProcessing}
        onClick={!isEditing ? this.startNewInstance : null}
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        {isEditing ? (
          <PlaceNameField
            handlePlaceRename={this.handlePlaceRename}
            isCreating={this.props.isCreating}
            projectPlaces={projectPlaces}
            stopNewPlace={this.props.stopNewPlace}
            stopPlaceRename={this.stopPlaceRename}
            placeName={this.state.placeName}
            placeRename={this.placeRename}
          />
        ) : (
          readMode
        )}
        {isDeleting ? (
          <PlaceDeleteModal
            handleClose={this.stopPlaceDelete}
            handleRemove={this.handlePlaceDelete}
            placeName={this.state.placeName}
          />
        ) : null}
      </El>
    );
  }
}

export default withStyles(styles)(PlaceControls);
