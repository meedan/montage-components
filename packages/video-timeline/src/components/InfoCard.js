import React from 'react';
import styled from 'styled-components';
import Flatted from 'flatted/esm';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import PlaceIcon from '@material-ui/icons/Place';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { color } from '@montage/ui/src/config';

import ArchiveMenuItem from './ofInfoCard/ArchiveMenuItem';
import FavMenuItem from './ofInfoCard/FavMenuItem';
import KeepListItem from './ofInfoCard/KeepListItem';
import MoreMenuItem from './ofInfoCard/MoreMenuItem';
import PublishedDateListItem from './ofInfoCard/PublishedDateListItem';
import RecordedDateListItem from './ofInfoCard/RecordedDateListItem';

import Map from './Map';

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
    height: '380px',
    position: 'relative',
    paddingBottom: '60px',
  },
};

function InfoCard(props) {
  // const [map, setMap] = useState(false);

  const { classes, data, currentTime, map, setMap } = props;
  const { archived_at, favourited } = data.gdVideoData;
  const isArchived = archived_at !== null && archived_at !== undefined;

  let videoPlaces = [];
  if (data.videoPlaces) videoPlaces = data.videoPlaces;
  const persisted2 = window.localStorage.getItem('videoPlaces');
  if (persisted2) videoPlaces = Flatted.parse(persisted2);

  let videoPlacesData = {};
  const persisted = window.localStorage.getItem('videoPlacesData');
  if (persisted) videoPlacesData = Flatted.parse(persisted);

  let mapData = videoPlaces
    .reduce(
      (acc, p) => [
        ...acc,
        ...p.instances.map(i => {
          if (!videoPlacesData) return null;
          if (!videoPlacesData[p.id]) return null;
          videoPlacesData[p.id].time = i.start_seconds;
          videoPlacesData[p.id].duration = i.end_seconds - i.start_seconds;
          return videoPlacesData[p.id];
        }),
        // ...p.instances.filter(i => !!i.data).map(i => i.data),
      ],
      []
    )
    .filter(d => !!d);

  // console.log(videoPlaces, videoPlacesData, mapData);

  return map ? (
    <Map
      id="TopMap"
      collapseMap={() => setMap(false)}
      currentTime={currentTime}
      data={mapData}
      expandMap={() => setMap(true)}
      isCompact={!map}
      onClose={() => setMap(false)}
    />
  ) : (
    <Card square elevation={0} className={classes.Card}>
      <CardHeader
        style={{ paddingBottom: 0 }}
        action={
          <div
            style={{
              position: 'relative',
              top: '8px',
            }}
          >
            {!isArchived ? <FavMenuItem favourited={favourited} /> : null}
            <ArchiveMenuItem archived_at={archived_at} />
            <MoreMenuItem {...props} />
          </div>
        }
        title={
          <Typography noWrap variant="h6">
            {data.ytVideoData.snippet.channelTitle}
          </Typography>
        }
      />
      <CardContent>
        <List dense disablePadding component="div">
          <ListItem component="div" dense>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${data.ytVideoData.statistics.viewCount} views`}
            />
          </ListItem>
          <PublishedDateListItem {...props} />
          <RecordedDateListItem {...props} />
          <KeepListItem {...props} />
        </List>
      </CardContent>
      <Divider variant="middle" />
      <CardContent>
        <MediaDescription color="textSecondary" component="div" variant="body2">
          {data.ytVideoData.snippet.description}
        </MediaDescription>
      </CardContent>
      <CardContent>
        <Button
          fullWidth
          variant="contained"
          style={{
            borderRadius: 0,
            boxShadow: 'none',
            paddingTop: 16,
            paddingBottom: 16,
          }}
          onClick={() => setMap(true)}
        >
          <PlaceIcon fontSize="small" style={{ marginRight: '5px' }} />{' '}
          <span style={{ color: color.brand }}>Set location</span>
        </Button>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(InfoCard);
