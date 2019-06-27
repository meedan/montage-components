import {
  array,
  bool,
  func,
  number,
  object,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import Flatted from 'flatted/esm';
import React, { Component } from 'react';
import ErrorBoundary from 'react-error-boundary';
import styled from 'styled-components';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import PlaceIcon from '@material-ui/icons/Place';
import VisibilityIcon from '@material-ui/icons/Visibility';

import Archive from './of/Archive';
import Favourite from './of/Favourite';
import Keep from './of/Keep';
import MoreMenu from './of/MoreMenu';
import PublishedDate from './of/PublishedDate';
import RecordedDate from './of/RecordedDate';
import PlacesMap from './of/PlacesMap';

const ROOT_HEIGHT = 380;
const MAP_HEIGHT = 80;

const MediaDescription = styled(Typography)`
  max-height: 50px;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${grey[400]};
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const styles = {
  Map: {
    position: 'absolute',
  },
  Root: {
    height: ROOT_HEIGHT,
    position: 'relative',
    paddingBottom: MAP_HEIGHT,
  },
};

class VideoMeta extends Component {
  constructor(props) {
    super(props);
    this.state = { map: false };
    this.switchMapDisplay = this.switchMapDisplay.bind(this);
  }

  switchMapDisplay() {
    console.log('switchMapDisplay()');
    this.setState(prevState => ({ map: !prevState.map }));
  }

  render() {
    const {
      arcDate,
      //
      classes,
      data,
      currentTime,
      setMap,
    } = this.props;
    const { map } = this.state;
    const isArchived = arcDate !== null && arcDate !== undefined;

    let videoPlaces = [];
    if (videoPlaces) ({ videoPlaces } = this.props);
    const persisted2 = window.localStorage.getItem('videoPlaces');
    if (persisted2) videoPlaces = Flatted.parse(persisted2);

    let videoPlacesData = {};
    const persisted = window.localStorage.getItem('videoPlacesData');
    if (persisted) videoPlacesData = Flatted.parse(persisted);

    // const mapData = videoPlaces
    //   .reduce(
    //     (acc, p) => [
    //       ...acc,
    //       ...p.instances.map(i => {
    //         if (!videoPlacesData) return null;
    //         if (!videoPlacesData[p.id]) return null;
    //         videoPlacesData[p.id].time = i.start_seconds;
    //         videoPlacesData[p.id].duration = i.end_seconds - i.start_seconds;
    //         return videoPlacesData[p.id];
    //       }),
    //       // ...p.instances.filter(i => !!i.data).map(i => i.data),
    //     ],
    //     []
    //   )
    //   .filter(d => !!d);

    const mapData = [];
    for (let v = 0; v < 23; v++) {
      mapData.push({
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        type: 'marker',
        time: Math.random() * 3600,
      });
    }

    console.group('Video Meta');
    console.log('state', this.state);
    console.log({ mapData });
    console.groupEnd();

    return (
      <Card square elevation={0} className={classes.Root}>
        <CardHeader
          style={{ paddingBottom: 0 }}
          action={
            <div
              style={{
                position: 'relative',
                top: '8px',
              }}
            >
              {!isArchived ? (
                <Favourite
                  onTriggerFavourite={this.props.onTriggerFavourite}
                  isFavourited={this.props.favourited}
                />
              ) : null}
              <Archive
                onTriggerArchive={this.props.onTriggerArchive}
                isArchived={isArchived}
              />
              <MoreMenu
                allocation={this.props.allocation}
                collections={this.props.collections}
                isArchived={isArchived}
                onCreateCollection={this.props.onCreateCollection}
                onDelete={this.props.onDelete}
                onManageDupes={this.props.onManageDupes}
                onTriggerDelete={this.props.onTriggerDelete}
                onUpdateAllocation={this.props.onUpdateAllocation}
                videoId={this.props.videoId}
              />
            </div>
          }
          title={
            <Typography noWrap variant="h6">
              {this.props.channelTitle}
            </Typography>
          }
        />
        <CardContent>
          <List dense disablePadding component="div">
            <ListItem component="div" dense>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary={`${this.props.videoViewCount} views`}>
                <Typography variant="body2">
                  {this.props.videoViewCount} views
                </Typography>
              </ListItemText>
            </ListItem>
            <PublishedDate pubDate={this.props.pubDate} />
            <RecordedDate
              date={this.props.recDate}
              isArchived={isArchived}
              isOverriden={this.props.recDateOverriden}
              onDateChange={this.props.onRecDateChange}
            />
            <ErrorBoundary>
              <Keep
                isArchived={isArchived}
                onTriggerKeep={this.props.onTriggerKeep}
                videoBackups={this.props.videoBackups}
                videoId={this.props.videoId}
              />
            </ErrorBoundary>
          </List>
        </CardContent>
        <Divider variant="middle" />
        <CardContent>
          <MediaDescription
            color="textSecondary"
            component="div"
            variant="body2"
          >
            {this.props.videoDescription}
          </MediaDescription>
        </CardContent>
        <CardContent>
          <div
            style={{
              bottom: 0,
              height: this.state.map ? ROOT_HEIGHT : MAP_HEIGHT,
              left: 0,
              position: 'absolute',
              right: 0,
              top: this.state.map ? '0' : 'auto',
              width: '100%',
            }}
          >
            <PlacesMap
              currentTime={currentTime}
              isCompact={!this.state.map}
              mapAPIKey={this.props.mapAPIKey}
              places={mapData}
              seekTo={this.props.seekTo}
              switchMapDisplay={this.switchMapDisplay}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(VideoMeta);

VideoMeta.propTypes = {
  allocation: array,
  arcDate: string,
  channelTitle: string.isRequired,
  classes: object,
  collections: array,
  currentTime: number,
  favourited: bool,
  mapAPIKey: string.isRequired,
  onCreateCollection: func.isRequired,
  onDelete: func.isRequired,
  onManageDupes: func.isRequired,
  onRecDateChange: func.isRequired,
  onTriggerArchive: func.isRequired,
  onTriggerDelete: func.isRequired,
  onTriggerFavourite: func.isRequired,
  onTriggerKeep: func.isRequired,
  onUpdateAllocation: func.isRequired,
  pubDate: string.isRequired,
  recDate: string,
  recDateOverriden: bool,
  videoBackups: shape({ videoBackupIds: array, videoBackups: array }),
  videoDescription: string.isRequired,
  videoId: oneOfType([string, number]).isRequired,
  videoPlaces: array,
  videoViewCount: string.isRequired,
};
VideoMeta.defaultProps = {
  allocation: [],
  arcDate: null,
  classes: {},
  collections: [],
  currentTime: 0,
  favourited: null,
  recDate: null,
  recDateOverriden: null,
  videoBackups: { videoBackupIds: [], videoBackups: [] },
  videoPlaces: [],
};
