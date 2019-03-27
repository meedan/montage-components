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
  const [map, setMap] = useState(0);

  const { data } = props;
  const { archived_at } = data.gdVideoData;
  const isArchived = archived_at !== null && archived_at !== undefined;

  if (map) return <Map />;

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
