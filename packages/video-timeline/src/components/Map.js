import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SearchIcon from '@material-ui/icons/Search';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import CheckIcon from '@material-ui/icons/Check';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

const classes = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

class Map extends Component {
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
      this.map.fitBounds(place.geometry.viewport);

      const { lat, lng } = place.geometry.location;
      this.setState({
        dropPin: true,
        marker: { lat, lng, type: 'marker', time: this.props.currentTime || 0 },
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
    this.setState({ dropPin: !this.state.dropPin, drawPolygon: false });
  };

  toggleDrawPolygon = () => {
    this.setState({ dropPin: false, drawPolygon: !this.state.drawPolygon });
  };

  saveCurrent = () => {
    let marker = null;

    if (this.state.marker.type === 'marker' && this.marker) {
      const { lat, lng } = this.marker.getPosition();

      marker = {
        lat: lat(),
        lng: lng(),
        type: 'marker',
        time: this.state.marker.currentTime,
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
        time: this.state.marker.currentTime,
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

    this.props.onSave(marker);
  };

  deleteCurrent = () => {
    this.setState({
      drawPolygon: false,
      dropPin: false,
      marker: {},
      saved: true,
    });
  };

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
          time: this.props.currentTime,
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
        },
      });
    }
  };

  // handleMarkerClick = e => {
  //   // e.stopPropagation();
  // };
  //
  // handleMarkerUpdate = () => {
  //   setTimeout(() => {
  //     console.log(this.marker.getPosition());
  //   }, 0);
  //   // console.log(this.marker);
  //   // this.map.panTo(this.maker.position);
  //   // const { lat, lng } = this.marker.getPosition();
  //   // this.setState({
  //   //   saved: false,
  //   //   marker: {
  //   //     lat: lat(),
  //   //     lng: lng(),
  //   //     type: 'marker',
  //   //     time: this.props.currentTime,
  //   //   },
  //   // });
  // };

  render() {
    console.log(this.state);
    const polygonOptions = {
      fillColor: 'lightblue',
      fillOpacity: 0.5,
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      geodesic: true,
      zIndex: 1,
    };

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
      <>
        <Paper className={classes.root} elevation={1}>
          <IconButton className={classes.iconButton}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <InputBase
            inputRef={this.searchRef}
            className={classes.input}
            placeholder="Search Google Maps"
          />
          <IconButton className={classes.iconButton}>
            <SearchIcon />
          </IconButton>
          {/* <Divider className={classes.divider} /> */}
          <IconButton
            color={this.state.dropPin ? 'primary' : 'secondary'}
            className={classes.iconButton}
            onClick={this.toggleDropPin}
          >
            <AddLocationIcon />
          </IconButton>
          <IconButton
            color={this.state.drawPolygon ? 'primary' : 'secondary'}
            className={classes.iconButton}
            onClick={this.toggleDrawPolygon}
          >
            <FormatShapesIcon />
          </IconButton>
          <IconButton
            color={
              this.state.marker && this.state.marker.type && !this.state.saved
                ? 'primary'
                : 'secondary'
            }
            className={classes.iconButton}
            onClick={this.deleteCurrent}
          >
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton
            color={!this.state.saved ? 'primary' : 'secondary'}
            className={classes.iconButton}
            onClick={this.saveCurrent}
          >
            <CheckIcon />
          </IconButton>
        </Paper>
        <LoadScript
          id="script-loader"
          googleMapsApiKey="***REMOVED***"
          libraries={['places', 'drawing', 'geometry']}
          onLoad={this.onScriptLoad}
        >
          <GoogleMap
            id="montage-map"
            mapContainerStyle={{
              height: '400px',
              width: '100%',
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
                editable={this.state.drawPolygon}
                path={this.state.marker.polygon}
                onLoad={polygon => (this.polygon = polygon)}
              />
            ) : null}
            {this.state.marker.type === 'marker' ? (
              <Marker
                draggable={this.state.dropPin}
                animation={window.google && window.google.maps.Animation.DROP}
                position={{
                  lat: this.state.marker.lat,
                  lng: this.state.marker.lng,
                }}
                onLoad={marker => (this.marker = marker)}
              />
            ) : null}
            {this.props.data
              .filter(d => d.type === 'marker')
              .map(({ lat, lng }) => (
                <Marker
                  draggable
                  animation={window.google && window.google.maps.Animation.DROP}
                  position={{ lat, lng }}
                />
              ))}
            {this.props.data
              .filter(d => d.type === 'polygon')
              .map(polygon => (
                <Polygon
                  onLoad={polygon => {
                    console.log('polygon: ', polygon);
                  }}
                  path={polygon.polygon}
                  options={polygonOptions}
                />
              ))}
          </GoogleMap>
        </LoadScript>
      </>
    );
  }
}

export default Map;
