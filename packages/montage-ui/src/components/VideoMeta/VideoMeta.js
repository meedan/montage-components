import { array, bool, func, number, shape, string } from "prop-types";
import Flatted from "flatted/esm";
import React, { Component } from "react";
import styled from "styled-components";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import grey from "@material-ui/core/colors/grey";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaceIcon from "@material-ui/icons/Place";
import Typography from "@material-ui/core/Typography";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { color } from "@montage/ui/src/config";

import ArchiveStatus from "./of/ArchiveStatus";
import FavouriteStatus from "./of/FavouriteStatus";
import KeepStatus from "./of/KeepStatus";
import MoreMenuItem from "./of/MoreMenuItem";
import PublishedDateListItem from "./of/PublishedDateListItem";
import RecordedDateListItem from "./of/RecordedDateListItem";

// import Map from './Map';

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
  Card: {
    height: "380px",
    position: "relative",
    paddingBottom: "60px"
  }
};

class VideoMeta extends Component {
  render() {
    const {
      arcDate,
      channelTitle,
      pubDate,
      videoDescription,
      videoViewCount,
      onRecDateChange,
      favourited,
      //
      classes,
      data,
      currentTime,
      map,
      setMap
    } = this.props;
    const isArchived = arcDate !== null && arcDate !== undefined;

    let videoPlaces = [];
    if (videoPlaces) ({ videoPlaces } = this.props);
    const persisted2 = window.localStorage.getItem("videoPlaces");
    if (persisted2) videoPlaces = Flatted.parse(persisted2);

    let videoPlacesData = {};
    const persisted = window.localStorage.getItem("videoPlacesData");
    if (persisted) videoPlacesData = Flatted.parse(persisted);

    const mapData = videoPlaces
      .reduce(
        (acc, p) => [
          ...acc,
          ...p.instances.map(i => {
            if (!videoPlacesData) return null;
            if (!videoPlacesData[p.id]) return null;
            videoPlacesData[p.id].time = i.start_seconds;
            videoPlacesData[p.id].duration = i.end_seconds - i.start_seconds;
            return videoPlacesData[p.id];
          })
          // ...p.instances.filter(i => !!i.data).map(i => i.data),
        ],
        []
      )
      .filter(d => !!d);

    // console.log(videoPlaces, videoPlacesData, mapData);

    console.group("VideoMeta");
    console.log(this.props);
    console.groupEnd();

    return map ? null : ( // /> //   onClose={() => setMap(false)} //   isCompact={!map} //   expandMap={() => setMap(true)} //   data={mapData} //   currentTime={currentTime} //   collapseMap={() => setMap(false)} //   id="TopMap" // <Map
      <Card square elevation={0} className={classes.Card}>
        <CardHeader
          style={{ paddingBottom: 0 }}
          action={(
            <div
              style={{
                position: "relative",
                top: "8px"
              }}
            >
              {!isArchived ? (
                <FavouriteStatus
                  onFavouriteClick={this.props.onFavouriteClick}
                  isFavourited={favourited}
                />
              ) : null}
              <ArchiveStatus
                onArchiveClick={this.props.onArchiveClick}
                isArchived={isArchived}
              />
              {/* <MoreMenuItem {...this.props} /> */}
            </div>
)}
          title={(
            <Typography noWrap variant="h6">
              {channelTitle}
            </Typography>
)}
        />
        <CardContent>
          <List dense disablePadding component="div">
            <ListItem component="div" dense>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary={`${videoViewCount} views`} />
            </ListItem>
            <PublishedDateListItem pubDate={pubDate} />
            <RecordedDateListItem
              {...this.props}
              callback={onRecDateChange}
              isArchived={isArchived}
            />
            <KeepStatus
              isArchived={isArchived}
              videoBackups={this.props.videoBackups}
              videoBackupSettings={this.props.videoBackupSettings}
              videoId={this.props.videoId}
            />
          </List>
        </CardContent>
        <Divider variant="middle" />
        <CardContent>
          <MediaDescription
            color="textSecondary"
            component="div"
            variant="body2"
          >
            {videoDescription}
          </MediaDescription>
        </CardContent>
        <CardContent>
          <Button
            fullWidth
            variant="contained"
            style={{
              borderRadius: 0,
              boxShadow: "none",
              paddingTop: 16,
              paddingBottom: 16
            }}
            onClick={() => setMap(true)}
          >
            <PlaceIcon fontSize="small" style={{ marginRight: "5px" }} />{" "}
            <span style={{ color: color.brand }}>Set location</span>
          </Button>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(VideoMeta);

VideoMeta.propTypes = {
  arcDate: string,
  channelTitle: string.isRequired,
  currentTime: number,
  favourited: bool,
  onArchiveClick: func.isRequired,
  onFavouriteClick: func.isRequired,
  onRecDateChange: func.isRequired,
  pubDate: string.isRequired,
  videoBackups: shape({ videoBackupIds: array, videoBackups: array }),
  videoBackupSettings: shape({
    backupServices: array.isRequired,
    backupServiceIds: array.isRequired
  }).isRequired,
  videoDescription: string.isRequired,
  videoId: string.isRequired,
  videoPlaces: array,
  videoViewCount: string.isRequired
};
VideoMeta.defaultProps = {
  arcDate: null,
  currentTime: 0,
  favourited: null,
  videoBackups: { videoBackupIds: [], videoBackups: [] },
  videoPlaces: []
};
