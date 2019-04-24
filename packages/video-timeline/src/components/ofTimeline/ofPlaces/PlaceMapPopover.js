import React, { Component } from 'react';
import styled from 'styled-components';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import equal from 'fast-deep-equal';

import { withStyles } from '@material-ui/core/styles';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import grey from '@material-ui/core/colors/grey';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import { color } from '@montage/ui';

const Separator = styled.span`
  border-left: 1px solid ${grey[300]};
  display: inline-block;
  height: 18px;
  margin-left: 4px;
  margin-right: 4px;
  width: 1px;
`;

const styles = {
  Button: {
    height: 28,
    minWidth: 'auto',
    width: 32,
  },
  Input: {
    padding: 8,
  },
  SaveIcon: {
    fontSize: '22px',
    position: 'relative',
    top: '-3px',
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

class PlaceMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropPin: false,
      drawPolygon: false,
      saved: true,
      marker: this.props.marker || {},
    };

    this.searchRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentTime !== nextProps.currentTime) {
      const match = this.props.data.find(
        ({ time, duration }) =>
          time <= nextProps.currentTime &&
          nextProps.currentTime < time + duration
      );
      if (match && this.map) {
        const { lat, lng, viewport } =
          match.type === 'marker' ? match : match.polygon[0];
        this.map.panTo({ lat, lng });
        viewport && this.map.fitBounds(viewport);
      }
    }

    return !equal(this.state, nextState);
  }

  onScriptLoad = () => {
    this.autocomplete = new window.google.maps.places.Autocomplete(
      this.searchRef.current,
      {}
    );
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  };

  handlePlaceSelect = e => {
    const place = this.autocomplete.getPlace();
    console.log(place);
    if (place && place.geometry) {
      this.map.fitBounds(place.geometry.viewport.toJSON());

      const { lat, lng } = place.geometry.location;
      this.setState({
        dropPin: false,
        marker: {
          lat: lat(),
          lng: lng(),
          viewport: place.geometry.viewport.toJSON(),
          type: 'marker',
          time: this.props.currentTime || 0,
        },
      });
    }
  };

  onLoad = autocomplete => {
    console.log('autocomplete: ', autocomplete);
    this.autocomplete = autocomplete;
  };

  onPlaceChanged = () => {
    if (this.autocomplete !== null) {
      console.log(this.autocomplete.getPlace());
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  toggleDropPin = () => {
    this.setState({ dropPin: true, drawPolygon: false, marker: {} });
  };

  toggleDrawPolygon = () => {
    this.setState({ dropPin: false, drawPolygon: true, marker: {} });
  };

  saveCurrent = () => {
    let marker = null;

    if (this.state.marker.type === 'marker' && this.marker) {
      const { lat, lng } = this.marker.getPosition();

      marker = {
        lat: lat(),
        lng: lng(),
        type: 'marker',
        time: this.props.currentTime,
        viewport: this.state.marker.viewport,
      };

      this.setState({
        drawPolygon: false,
        dropPin: false,
        saved: true,
        marker,
      });
    } else if (this.state.marker.type === 'polygon' && this.polygon) {
      const polygon = [];
      this.polygon
        .getPath()
        .forEach(({ lat, lng }) => polygon.push({ lat: lat(), lng: lng() }));

      marker = {
        polygon: polygon,
        type: 'polygon',
        time: this.props.currentTime,
        viewport: this.state.marker.viewport,
      };

      this.setState({
        drawPolygon: false,
        dropPin: false,
        saved: true,
        marker,
      });
    } else {
      this.setState({
        drawPolygon: false,
        dropPin: false,
        saved: true,
      });
    }

    // this.props.onSave(marker);
    this.props.onClose();
  };

  // deleteCurrent = () => {
  //   this.setState({
  //     drawPolygon: false,
  //     dropPin: false,
  //     marker: {},
  //     saved: true,
  //   });
  // };

  handleMapClick = e => {
    if (this.state.dropPin) {
      const { lat, lng } = e.latLng;
      console.log(lat, lng);
      this.setState({
        saved: false,
        marker: {
          lat: lat(),
          lng: lng(),
          type: 'marker',
          time: this.props.currentTime || 0,
          viewport: this.map.getBounds().toJSON(),
        },
      });
    }

    if (this.state.drawPolygon) {
      const { lat, lng } = e.latLng;
      this.setState({
        saved: false,
        marker: {
          polygon: [
            ...(this.state.marker.polygon || []),
            { lat: lat(), lng: lng() },
          ],
          type: 'polygon',
          currentTime: this.props.currentTime || 0,
          viewport: this.map.getBounds().toJSON(),
        },
      });
    }
  };

  handleMarkerClick = time => {
    if (this.props.player) this.props.player.seekTo(time);
  };

  handleMarkerUpdate = () => {
    setTimeout(() => {
      const { lat, lng } = this.marker.getPosition();
      const lt = lat();
      const lg = lng();

      if (lt !== this.state.marker.lat && lg !== this.state.marker.lng) {
        this.setState({
          marker: {
            lat: lat(),
            lng: lng(),
            type: 'marker',
            time: this.state.marker.currentTime,
            viewport: this.map.getBounds().toJSON(),
          },
        });
      }
    }, 0);
  };

  setStep(step) {
    this.setState({ step: step });
  }

  render() {
    const { classes } = this.props;
    const { dropPin, drawPolygon, marker } = this.state;

    const polygonOptions = {
      clickable: true,
      draggable: false,
      editable: true,
      fillColor: '000',
      fillOpacity: 0.1,
      geodesic: false,
      strokeColor: color.brand,
      strokeOpacity: 1,
      strokeWeight: 2,
      zIndex: 1,
    };

    console.group('PlaceMapPopover');
    console.log('props', this.props);
    console.log('state', this.state);
    console.groupEnd();

    const center = this.props.data
      .reduce(
        (acc, d) => {
          const coords =
            d.type === 'marker' ? [{ lat: d.lat, lng: d.lng }] : d.polygon;
          return [...coords, ...acc];
        },
        [{ lat: 0, lng: 0 }]
      )
      .reverse()
      .pop();

    return (
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorEl={this.props.anchorRef}
        open
        onClick={e => e.stopPropagation()}
        PaperProps={{ square: true }}
        onEscapeKeyDown={this.props.isCreating}
      >
        <TextField
          autoFocus
          fullWidth
          inputRef={this.searchRef}
          placeholder="Find location…"
          InputProps={{
            classes: {
              root: classes.Input,
            },
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Change name…">
                  <IconButton onClick={this.props.startPlaceRename}>
                    <KeyboardBackspaceIcon fontSize="small" color="disabled" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Separator />
                <Tooltip title="Drop a pin">
                  <IconButton
                    color={
                      dropPin && marker.type !== 'marker'
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={this.toggleDropPin}
                  >
                    <AddLocationIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Mark an area">
                  <IconButton
                    color={
                      drawPolygon && marker.type !== 'polygon'
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={this.toggleDrawPolygon}
                  >
                    <FormatShapesIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Separator />
                {/* <Tooltip title="Delete">
                      <IconButton
                        color={
                          this.state.marker &&
                          this.state.marker.type &&
                          !this.state.saved
                            ? 'primary'
                            : 'secondary'
                        }
                        onClick={this.deleteCurrent}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip> */}
                {this.state.marker.type ? (
                  <Tooltip title="Save location">
                    <Button
                      disabled={this.state.saved}
                      className={classes.Button}
                      color="primary"
                      onClick={this.saveCurrent}
                      variant="contained"
                    >
                      <CheckIcon
                        fontSize="small"
                        className={classes.SaveIcon}
                      />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Close">
                    <IconButton
                      onClick={
                        this.props.isCreating
                          ? this.props.stopNewPlace
                          : this.props.onClose
                      }
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </InputAdornment>
            ),
          }}
        />
        <LoadScript
          googleMapsApiKey="***REMOVED***"
          libraries={['places', 'drawing', 'geometry']}
          onLoad={this.onScriptLoad}
        >
          <GoogleMap
            mapContainerStyle={{
              height: '240px',
              width: '400px',
            }}
            zoom={2.5}
            center={center}
            onClick={this.handleMapClick}
            onLoad={map => (this.map = map)}
            options={{
              draggableCursor:
                this.state.dropPin || this.state.drawPolygon
                  ? 'crosshair'
                  : 'grab',
              mapTypeControl: false,
              streetViewControl: true,
              streetViewControlOptions: {
                position:
                  window.google &&
                  window.google.maps.ControlPosition.LEFT_BOTTOM,
              },
            }}
          >
            {this.state.marker.type === 'polygon' &&
            this.state.marker.polygon.length > 0 ? (
              <Polygon
                key="poly"
                editable={this.state.drawPolygon}
                path={this.state.marker.polygon}
                onLoad={polygon => (this.polygon = polygon)}
                options={polygonOptions}
              />
            ) : null}
            {this.state.marker.type === 'marker' ? (
              <Marker
                key="marker"
                draggable={this.state.dropPin}
                animation={window.google && window.google.maps.Animation.DROP}
                position={{
                  lat: this.state.marker.lat,
                  lng: this.state.marker.lng,
                }}
                onLoad={marker => (this.marker = marker)}
                onPositionChanged={this.handleMarkerUpdate}
              />
            ) : null}
            {this.props.data
              .filter(d => d.type === 'marker')
              .map(({ lat, lng, time }, i) => (
                <Marker
                  key={`m-${i}`}
                  draggable
                  animation={window.google && window.google.maps.Animation.DROP}
                  position={{ lat, lng }}
                  onClick={() => this.handleMarkerClick(time)}
                />
              ))}
            {this.props.data
              .filter(d => d.type === 'polygon')
              .map((polygon, i) => (
                <Polygon
                  key={`p-${i}`}
                  onLoad={polygon => {
                    console.log('polygon: ', polygon);
                  }}
                  path={polygon.polygon}
                  options={polygonOptions}
                  onClick={() => this.handleMarkerClick(polygon.time)}
                />
              ))}
          </GoogleMap>
        </LoadScript>
      </Popover>
    );
  }
}

export default withStyles(styles)(PlaceMap);
