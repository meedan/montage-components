import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlaceIcon from '@material-ui/icons/Place';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ArchiveMenuItem from './ofInfoCard/ArchiveMenuItem';
import FavMenuItem from './ofInfoCard/FavMenuItem';
import KeepListItem from './ofInfoCard/KeepListItem';
import MoreMenuItem from './ofInfoCard/MoreMenuItem';
import PublishedDateListItem from './ofInfoCard/PublishedDateListItem';
import RecordedDateListItem from './ofInfoCard/RecordedDateListItem';

import Map from './Map';

import { color } from '@montage/ui';

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

function InfoCard(props) {
  const [map, setMap] = useState(true);

  const { data, currentTime, player } = props;
  const { archived_at } = data.gdVideoData;
  const isArchived = archived_at !== null && archived_at !== undefined;

  const mapData = [
    {
      lat: -33.86824956555994,
      lng: 151.20569061108404,
      type: 'marker',
      viewport: {
        south: -33.886505479781086,
        west: 151.18009868311879,
        north: -33.829485002290966,
        east: 151.24590131688115,
      },
      time: 0,
    },
    {
      lat: 43.6531254,
      lng: 11.183055100000047,
      type: 'marker',
      viewport: {
        south: 43.65121689999994,
        west: 11.181682169708438,
        north: 43.65506770000007,
        east: 11.184380130291515,
      },
      time: 0,
    },
    { lat: -31.56391, lng: 147.154312, type: 'marker', time: 0 },
    { lat: -33.718234, lng: 150.363181, type: 'marker', time: 0 },
    { lat: -33.727111, lng: 150.371124, type: 'marker', time: 0 },
    { lat: -33.848588, lng: 151.209834, type: 'marker', time: 0 },
    { lat: -33.851702, lng: 151.216968, type: 'marker', time: 0 },
    { lat: -34.671264, lng: 150.863657, type: 'marker', time: 0 },
    { lat: -35.304724, lng: 148.662905, type: 'marker', time: 0 },
    { lat: -36.817685, lng: 175.699196, type: 'marker', time: 0 },
    { lat: -36.828611, lng: 175.790222, type: 'marker', time: 0 },
    { lat: -37.75, lng: 145.116667, type: 'marker', time: 0 },
    { lat: -37.759859, lng: 145.128708, type: 'marker', time: 0 },
    { lat: -37.765015, lng: 145.133858, type: 'marker', time: 0 },
    { lat: -37.770104, lng: 145.143299, type: 'marker', time: 0 },
    { lat: -37.7737, lng: 145.145187, type: 'marker', time: 0 },
    { lat: -37.774785, lng: 145.137978, type: 'marker', time: 0 },
    { lat: -37.819616, lng: 144.968119, type: 'marker', time: 0 },
    { lat: -38.330766, lng: 144.695692, type: 'marker', time: 0 },
    { lat: -39.927193, lng: 175.053218, type: 'marker', time: 0 },
    { lat: -41.330162, lng: 174.865694, type: 'marker', time: 0 },
    { lat: -42.734358, lng: 147.439506, type: 'marker', time: 0 },
    { lat: -42.734358, lng: 147.501315, type: 'marker', time: 0 },
    { lat: -42.735258, lng: 147.438, type: 'marker', time: 0 },
    { lat: -43.999792, lng: 170.463352, type: 'marker', time: 0 },
    {
      type: 'polygon',
      time: 0,
      polygon: [
        { lat: -33.858, lng: 151.213 },
        { lat: -33.859, lng: 151.222 },
        { lat: -33.866, lng: 151.215 },
      ],
    },
  ].map((d, i) => {
    d.time = i * 10;
    d.duration = 5;
    return d;
  });

  if (map)
    return (
      <Map
        key="map"
        data={mapData}
        currentTime={currentTime}
        player={player}
        onSave={d => console.log(d)}
      />
    );

  return (
    <Card square elevation={0}>
      <CardHeader
        style={{ paddingBottom: 0 }}
        action={
          <div
            style={{
              position: 'relative',
              top: '8px',
            }}
          >
            {!isArchived ? <FavMenuItem {...props} /> : null}
            <ArchiveMenuItem {...props} />
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
    </Card>
  );
}

export default InfoCard;
