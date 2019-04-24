import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import equal from 'fast-deep-equal';

import { color } from '@montage/ui';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropPin: false,
      drawPolygon: false,
      saved: true,
      marker: this.props.marker || {},
    };
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
    } else if (this.props.isCompact !== nextProps.isCompact) {
      return true;
    }
    return !equal(this.state, nextState);
  }

  onMapClick = e => {
    console.log('onMapClick()');
    console.log({ e });
    return this.props.isCompact
      ? this.props.expandMap()
      : this.props.collapseMap();
  };

  handleMarkerClick = (time, e) => {
    console.log({ e });
    // e.stopPropagation();
    if (this.props.player) this.props.player.seekTo(time);
  };

  render() {
    const { isCompact } = this.props;
    console.group('Map.js');
    console.log(this.state);
    console.log(this.props);
    console.log(isCompact);
    console.groupEnd();

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
      <LoadScript
        googleMapsApiKey="AIzaSyASFlPz3OiJvgzeUCZoA9JLtUJYN89s8y0"
        libraries={['places', 'drawing', 'geometry']}
        onLoad={this.onScriptLoad}
      >
        <GoogleMap
          mapContainerStyle={{
            bottom: '0',
            height: this.props.isCompact ? '73px' : '380px',
            left: '0',
            position: 'absolute',
            right: '0',
            width: '100%',
          }}
          zoom={2.5}
          center={center}
          onClick={this.onMapClick}
          onLoad={map => (this.map = map)}
          options={{
            draggable: !isCompact,
            draggableCursor: isCompact ? 'pointer' : 'grab',
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            streetViewControlOptions: {
              position:
                window.google && window.google.maps.ControlPosition.LEFT_BOTTOM,
            },
          }}
        >
          {this.props.data
            .filter(d => d.type === 'marker')
            .map(({ lat, lng, time }, i) => (
              <Marker
                key={`m-${i}`}
                draggable
                animation={window.google && window.google.maps.Animation.DROP}
                position={{ lat, lng }}
                onClick={e => this.handleMarkerClick(time, e)}
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
                onClick={e => this.handleMarkerClick(polygon.time, e)}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
