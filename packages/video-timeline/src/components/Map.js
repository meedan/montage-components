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
      isClosed: false,
      marker: null,
      polyMarkers: [],
      markers: [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352},
      ],
      polygons: [[
          { lat: -33.858, lng: 151.213 },
          { lat: -33.859, lng: 151.222 },
          { lat: -33.866, lng: 151.215 },
        ]],
    };

    this.searchRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    return {
    };
  }

  onScriptLoad = () => {
    const options = { /* types: ['(cities)'] */ };

    // Initialize Google Autocomplete
    this.autocomplete = new window.google.maps.places.Autocomplete(this.searchRef.current, options);
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect = (e) => {
    const place = this.autocomplete.getPlace();
    console.log(place);
    if (place && place.geometry) {
      this.map.fitBounds(place.geometry.viewport);
      this.setState({
        dropPin: true,
        marker: place.geometry.location,
      });
    }
  }

  onLoad = autocomplete => {
    console.log('autocomplete: ', autocomplete);
    this.autocomplete = autocomplete;
  }

  onPlaceChanged = () => {
    if (this.autocomplete !== null) {
      console.log(this.autocomplete.getPlace());
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  }

  toggleDropPin = () => {
    this.setState({ dropPin: !this.state.dropPin });
  }

  toggleDrawPolygon = () => {
    this.setState({ drawPolygon: !this.state.drawPolygon });
  }

  saveCurrent = () => {
    this.setState({ drawPolygon: false, dropPin: false });
    // TODO save
  }

  deleteCurrent = () => {
    this.setState({ drawPolygon: false, dropPin: false, marker: null, polyMarkers: [] });
  }

  handleMapClick = (e) => {
    if (this.state.dropPin) {
      this.setState({
        // dropPin: !this.state.dropPin,
        marker: e.latLng,
      });
    }

    if (this.state.drawPolygon && !this.state.isClosed) {
      this.setState({
        polyMarkers: [ ...this.state.polyMarkers, e.latLng ],
      });
    }
  }

  render() {
    const polygonOptions = {
      fillColor: 'lightblue',
      fillOpacity: .5,
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 2,
      clickable: false,
      draggable: false,
      editable: false,
      geodesic: true,
      // paths: TEST,
      zIndex: 1,
    };


    return (
      <>
        <Paper className={classes.root} elevation={1}>
          <IconButton className={classes.iconButton}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <InputBase inputRef={this.searchRef} className={classes.input} placeholder="Search Google Maps" />
          <IconButton className={classes.iconButton}>
            <SearchIcon />
          </IconButton>
          { /* <Divider className={classes.divider} /> */ }
          <IconButton color={this.state.dropPin ? 'primary' : 'secondary'} className={classes.iconButton} onClick={this.toggleDropPin}>
            <AddLocationIcon />
          </IconButton>
          <IconButton color={this.state.drawPolygon ? 'primary' : 'secondary'} className={classes.iconButton} onClick={this.toggleDrawPolygon}>
            <FormatShapesIcon />
          </IconButton>
          <IconButton color={this.state.marker || this.state.polyMarkers.length > 0 ? 'primary' : 'secondary'} className={classes.iconButton} onClick={this.deleteCurrent}>
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton color={this.state.marker || this.state.polyMarkers.length ? 'primary' : 'secondary'} className={classes.iconButton} onClick={this.saveCurrent}>
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
              // cursor: this.state.dropPin ? 'crosshair' : 'grab',
            }}
            zoom={2.5}
            center={this.state.center ? this.state.center : this.state.markers[0]}
            onClick={this.handleMapClick}
            onLoad={(map) => this.map = map}

            options={{
              draggableCursor: this.state.dropPin || this.state.drawPolygon ? 'crosshair' : 'grab',
              mapTypeControl: false,
              streetViewControl: true,
              streetViewControlOptions: {
                position: window.google && window.google.maps.ControlPosition.LEFT_BOTTOM,
              },
            }}
          >
          {
            this.state.polyMarkers.length > 0 ? <Polygon editable={this.state.drawPolygon} path={this.state.polyMarkers} /> : null
          }
          {
            this.state.marker ? <Marker draggable={this.state.dropPin} animation={window.google && window.google.maps.Animation.DROP} position={this.state.marker} /> : null
          }
          {
            this.state.markers.map(position => <Marker draggable animation={window.google && window.google.maps.Animation.DROP} position={position} />)
          }
          {
            this.state.polygons.map(path => <Polygon
              onLoad={polygon => {
                console.log('polygon: ', polygon)
              }}
              path={path}
              options={polygonOptions}
            />)
          }
          </GoogleMap>
        </LoadScript>
      </>
    );
  }
}

export default Map;
