import { withTheme } from '@material-ui/core/styles';
import React from 'react';

import ArchiveIcon from '@material-ui/icons/Archive';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlaceIcon from '@material-ui/icons/Place';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

import KeepListItem from './ofInfoCard/KeepListItem';
import MoreMenu from './ofInfoCard/MoreMenu';
import PublishedDateListItem from './ofInfoCard/PublishedDateListItem';
import RecordedDateListItem from './ofInfoCard/RecordedDateListItem';

function InfoCard(props) {
  const { data } = props;

  return (
    <Card square elevation={0}>
      <CardHeader
        action={
          <>
            <IconButton>
              <Tooltip title="Add to Favorites" aria-label="Add to Favorites">
                <StarIcon />
              </Tooltip>
            </IconButton>
            <IconButton>
              <Tooltip title="Archive video" aria-label="Archive video">
                <ArchiveIcon />
              </Tooltip>
            </IconButton>
            <MoreMenu />
          </>
        }
        title={
          <Typography noWrap variant="h6">
            {data.ytVideoData.snippet.channelTitle}
          </Typography>
        }
      />

      <CardContent>
        <List dense disablePadding>
          <ListItem>
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
        <Typography component="p" variant="body2">
          {data.ytVideoData.snippet.description}
        </Typography>
      </CardContent>
      <CardActions>
        <ListItem button>
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText primary="Set location" />
        </ListItem>
      </CardActions>
    </Card>
  );
}

export default withTheme()(InfoCard);
