import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlaceIcon from '@material-ui/icons/Place';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import grey from '@material-ui/core/colors/grey';

import ArchiveMenuItem from './ofInfoCard/ArchiveMenuItem';
import FavMenuItem from './ofInfoCard/FavMenuItem';
import KeepListItem from './ofInfoCard/KeepListItem';
import MoreMenuItem from './ofInfoCard/MoreMenuItem';
import PublishedDateListItem from './ofInfoCard/PublishedDateListItem';
import RecordedDateListItem from './ofInfoCard/RecordedDateListItem';

const MediaDescription = styled(Typography)`
  max-height: 50px;
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

const styles = theme => ({
  title: {
    paddingBottom: 0,
  },
  headerAction: {
    position: 'relative',
    top: '8px',
  },
  locationButton: {
    borderRadius: 0,
    boxShadow: 'none',
    paddingTop: 16,
    paddingBottom: 16,
  },
});

function InfoCard(props) {
  const { data } = props;
  const { classes } = props;
  const { archived_at } = data.gdVideoData;
  const isArchived = archived_at !== null && archived_at !== undefined;

  return (
    <Card square elevation={0}>
      <CardHeader
        className={classes.title}
        action={
          <div className={classes.headerAction}>
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
        className={classes.locationButton}
        fullWidth
        secondary
        variant="contained"
      >
        <PlaceIcon fontSize="small" /> Set location
      </Button>
    </Card>
  );
}

export default withStyles(styles)(InfoCard);
