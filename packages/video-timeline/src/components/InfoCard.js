import React, { useState } from 'react';
import { withTheme } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import FolderIcon from '@material-ui/icons/Folder';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublishIcon from '@material-ui/icons/Publish';
import PlaceIcon from '@material-ui/icons/Place';
import ArchiveIcon from '@material-ui/icons/Archive';
import StarIcon from '@material-ui/icons/Star';
import VideoCallIcon from '@material-ui/icons/VideoCall';

import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const InfoCard = props => {
  const { data } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Card>
      <CardHeader
        action={
          <>
            <IconButton>
              <StarIcon />
            </IconButton>
            <IconButton>
              <ArchiveIcon />
            </IconButton>
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          </>
        }
        title={data.ytVideoData.snippet.channelTitle}
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

      <List disablePadding>
        <ListItem>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${data.ytVideoData.statistics.viewCount} views`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Published ${data.ytVideoData.snippet.publishedAt}`}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <CameraAltIcon />
          </ListItemIcon>
          <ListItemText primary="Set a recorded Date" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <VideoCallIcon />
          </ListItemIcon>
          <ListItemText primary="Send this video to Keep" />
        </ListItem>
      </List>

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
