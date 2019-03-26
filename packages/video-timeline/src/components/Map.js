import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import SearchIcon from '@material-ui/icons/Search';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import CheckIcon from '@material-ui/icons/Check';

// keyboardBackspace
// addLocation
// FormatShapes
// Check

// import styled from 'styled-components';

import { GoogleMap, LoadScript, Autocomplete, DrawingManager, StandaloneSearchBox } from '@react-google-maps/api';

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

    this.state = {};

    this.searchRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    return {
    };
  }

  onScriptLoad = () => {
    // Declare Options For Autocomplete
    var options = { types: ['(cities)'] };

    // Initialize Google Autocomplete
    this.autocomplete = new window.google.maps.places.Autocomplete(this.searchRef.current, options);
    // Fire Event when a suggested name is selected
    // this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
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

  render() {
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
          <IconButton color="primary" className={classes.iconButton}>
            <AddLocationIcon />
          </IconButton>
          <IconButton color="primary" className={classes.iconButton}>
            <FormatShapesIcon />
          </IconButton>
          <IconButton color="primary" className={classes.iconButton}>
            <CheckIcon />
          </IconButton>
        </Paper>
        <LoadScript
          id="script-loader"
          googleMapsApiKey="***REMOVED***"
          libraries={['places', 'drawing']}
          onLoad={this.onScriptLoad}
        >
          <GoogleMap
            id="montage-map"
            mapContainerStyle={{
              height: '400px',
              width: '100%',
            }}
            zoom={2.5}
            center={{
              lat: 38.685,
              lng: -115.234,
            }}

            options={{
              mapTypeControl: false,
              streetViewControl: true,
              streetViewControlOptions: {
                position: window.google && window.google.maps.ControlPosition.LEFT_BOTTOM,
              },
            }}
          >


            <DrawingManager
              onLoad={drawingManager => {
                console.log(drawingManager)
              }}
              options={{
                position: window.google && window.google.maps.ControlPosition.BOTTOM_CENTER,
                drawingModes: ['marker', 'rectangle'],
              }}
            />
          </GoogleMap>
        </LoadScript>
      </>
    );
  }
}

export default Map;
