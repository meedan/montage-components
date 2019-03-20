import React, { useState } from 'react';
import { withTheme } from '@material-ui/core/styles';
import { format } from 'date-fns';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import FolderIcon from '@material-ui/icons/Folder';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublishIcon from '@material-ui/icons/Publish';
import PlaceIcon from '@material-ui/icons/Place';
import ArchiveIcon from '@material-ui/icons/Archive';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import KeepIcon from '@montage/ui/src/components/icons/KeepIcon';

const InfoCard = props => {
  const { data } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Card square elevation={0}>
      <CardHeader
        action={
          <>
            <IconButton>
              <Tooltip title="Add to Favorites" aria-label="Add to Favorites">
                <StarIcon fontSize="small" />
              </Tooltip>
            </IconButton>
            <IconButton>
              <Tooltip title="Archive video" aria-label="Archive video">
                <ArchiveIcon fontSize="small" />
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleClick}>
              <Tooltip title="More options…" aria-label="More options…">
                <MoreVertIcon fontSize="small" />
              </Tooltip>
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
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText inset primary="Add to" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText inset primary="Manage duplicates" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText inset primary="Remove" />
        </MenuItem>
      </Menu>

      <CardContent>
        <List dense disablePadding>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={`${data.ytVideoData.statistics.viewCount} views`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PublishIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={`Published ${format(
                data.ytVideoData.snippet.publishedAt,
                'D MMMM YYYY'
              )}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CameraAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={<Link>Set a recorded Date</Link>} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <KeepIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={<Link>Send this video to Keep</Link>} />
          </ListItem>
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
            <PlaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Set location" />
        </ListItem>
      </CardActions>
    </Card>
  );
};

export default withTheme()(InfoCard);
