import { array, bool, func, number, object, string } from 'prop-types';
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import equal from 'fast-deep-equal';
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CloseIcon from '@material-ui/icons/Close';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';

const google = window.google && window.google.maps ? window.google : {};

class PlacesMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saved: true,
      marker: this.props.marker || {},
      center: null, // { lat: 0, lng: 0 },
    };

    this.searchRef = React.createRef();

    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerUpdate = this.handleMarkerUpdate.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.setStep = this.setStep.bind(this);
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
    const { marker } = this.state;

    console.log('——PLACESMAP——');
    console.log(this.props.mapAPIKey);

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
      <GoogleMap
        id={this.props.mapAPIKey}
        key={this.props.mapAPIKey}
        mapContainerStyle={{ height: '100%', width: '100%' }}
        zoom={2.5}
        center={center}
        onClick={this.props.switchMapDisplay}
        onLoad={this.onLoad}
        options={{
          draggableCursor: 'grab',
          zoomControl: this.props.isCompact ? false : true,
          streetViewControl: this.props.isCompact ? false : true,
          mapTypeControl: this.props.isCompact ? false : true,
          scaleControl: this.props.isCompact ? false : true,
          rotateControl: this.props.isCompact ? false : true,
          fullscreenControl: this.props.isCompact ? false : true,
        }}
      >
        {this.state.marker.type === 'polygon' &&
        this.state.marker.polygon.length > 0 ? (
          <Polygon
            key="poly"
            editable={false}
            path={this.state.marker.polygon}
            onLoad={polygon => (this.polygon = polygon)}
            options={polygonOptions}
          />
        ) : null}
        {this.state.marker.type === 'marker' ? (
          <Marker
            key="marker"
            draggable={false}
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
              draggable={false}
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
    );
  }
}

export default PlacesMap;

PlacesMap.propTypes = {
  currentTime: number,
  mapAPIKey: string.isRequired,
  places: array,
};
PlacesMap.defaultProps = {
  currentTime: 0,
  places: [],
};
