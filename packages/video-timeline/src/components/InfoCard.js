import { withTheme } from '@material-ui/core/styles';
import React, { useState } from 'react';

import ArchiveIcon from '@material-ui/icons/Archive';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlaceIcon from '@material-ui/icons/Place';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

import KeepListItem from './ofInfoCard/KeepListItem';
import PublishedDateListItem from './ofInfoCard/PublishedDateListItem';
import RecordedDateListItem from './ofInfoCard/RecordedDateListItem';

const InfoCard = props => {
  const { data } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log(data.gdVideoData.publish_date);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
            <IconButton onClick={handleClick}>
              <Tooltip title="More options…" aria-label="More options…">
                <MoreVertIcon />
              </Tooltip>
            </IconButton>
          </>
        }
        title={
          <Typography noWrap variant="h6">
            {data.ytVideoData.snippet.channelTitle}
          </Typography>
        }
      />
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText inset primary="Add to" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText inset primary="Manage duplicates" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText inset primary="Remove" />
        </MenuItem>
      </Menu>

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
};

export default withTheme()(InfoCard);
