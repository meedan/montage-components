import { array, bool, func, number, object, string } from 'prop-types';
import { GoogleMap, Marker, Polygon } from '@react-google-maps/api';
import equal from 'fast-deep-equal';
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CloseIcon from '@material-ui/icons/Close';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';

class PlacesMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marker: this.props.marker || {},
      center: null, // { lat: 0, lng: 0 },
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
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
    if (this.props.isCompact !== nextProps.isCompact) {
      return true;
    }

    return !equal(this.state, nextState);
  }

  handleMarkerClick(time) {
    this.props.seekTo({ seekTo: time, transport: 'map' });
  }

  render() {
    const { classes, places, id } = this.props;
    const { marker } = this.state;

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
        center={center}
        mapContainerStyle={{ height: '100%', width: '100%' }}
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
        zoom={this.props.isCompact ? 10 : 2.5}
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

const polygonOptions = {
  clickable: true,
  draggable: false,
  editable: false,
  fillColor: '000',
  fillOpacity: 0.1,
  geodesic: false,
  // strokeColor: color.brand, // FIXME @pio
  strokeOpacity: 1,
  strokeWeight: 2,
  zIndex: 1,
};

export default PlacesMap;

PlacesMap.propTypes = {
  currentTime: number,
  places: array,
};
PlacesMap.defaultProps = {
  currentTime: 0,
  places: [],
};
