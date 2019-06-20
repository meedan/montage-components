import { array, bool, func, number, object, string } from 'prop-types';
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import equal from 'fast-deep-equal';
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@material-ui/core';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CloseIcon from '@material-ui/icons/Close';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';

const styles = theme => ({
  MapWrapper: {},
});

class PlacesMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropPin: false,
      drawPolygon: false,
      saved: true,
      marker: this.props.marker || {},
      center: null, // { lat: 0, lng: 0 },
    };

    this.searchRef = React.createRef();

    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerUpdate = this.handleMarkerUpdate.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.saveCurrent = this.saveCurrent.bind(this);
    this.setStep = this.setStep.bind(this);
    this.toggleDrawPolygon = this.toggleDrawPolygon.bind(this);
    this.toggleDropPin = this.toggleDropPin.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentTime !== nextProps.currentTime) {
      const match = this.props.places.find(
        ({ time, duration }) =>
          time <= nextProps.currentTime &&
          nextProps.currentTime < time + duration
      );

      // console.log(match);
      if (match && this.map) {
        const { lat, lng, viewport } =
          match.type === 'marker' ? match : match.polygon[0];
        this.map.panTo({ lat, lng });
        viewport && this.map.fitBounds(viewport);
        this.setState({ center: { lat, lng } });
      }
    }

    return !equal(this.state, nextState);
  }

  handlePlaceSelect(e) {
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
  }

  onLoad(map) {
    this.map = map;

    this.autocomplete = new window.google.maps.places.Autocomplete(
      this.searchRef.current,
      {}
    );
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  onPlaceChanged() {
    if (this.autocomplete !== null) {
      console.log(this.autocomplete.getPlace());
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  toggleDropPin() {
    this.setState({ dropPin: true, drawPolygon: false, marker: {} });
  }

  toggleDrawPolygon() {
    this.setState({ dropPin: false, drawPolygon: true, marker: {} });
  }

  saveCurrent() {
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
  }

  // deleteCurrent = () => {
  //   this.setState({
  //     drawPolygon: false,
  //     dropPin: false,
  //     marker: {},
  //     saved: true,
  //   });
  // };

  handleMapClick(e) {
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
          lat: lat(), // TODO use center
          lng: lng(),
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
  }

  handleMarkerClick(time) {
    this.props.seekTo(time);
  }

  handleMarkerUpdate() {
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
  }

  setStep(step) {
    this.setState({ step: step });
  }

  render() {
    const { classes, places, id } = this.props;
    const { dropPin, drawPolygon, marker } = this.state;

    let center = places
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

    if (this.state.center) center = this.state.center;
    if (marker && marker.lat && marker.lng)
      center = { lat: marker.lat, lng: marker.lng };

    if (this.map && this.map.center) center = this.map.center;

    return (
      <Grid container direction="column">
        <Grid item xs={2}>
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
                  <Tooltip title="Back…">
                    <IconButton onClick={this.props.onClose}>
                      <KeyboardBackspaceIcon
                        fontSize="small"
                        color="disabled"
                      />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {/* <Separator /> */}
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
                  {/* <Separator /> */}
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
        </Grid>
        <Grid item xs={10}>
          <GoogleMap
            id={this.props.mapAPIKey}
            key={this.props.mapAPIKey}
            mapContainerStyle={{
              height: '334px',
              width: '100%',
            }}
            zoom={2.5}
            center={center}
            onClick={this.handleMapClick}
            onLoad={this.onLoad}
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
            {this.props.places
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
            {this.props.places
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
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PlacesMap);

PlacesMap.propTypes = {
  currentTime: number,
  mapAPIKey: string.isRequired,
  places: array,
};
PlacesMap.defaultProps = {
  currentTime: 0,
  places: [],
};
