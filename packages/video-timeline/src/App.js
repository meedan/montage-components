import React, { Component } from 'react';
import { react2angular } from 'react2angular';

import ReactPlayer from 'react-player';

import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import FolderIcon from '@material-ui/icons/Folder';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublishIcon from '@material-ui/icons/Publish';
import PlaceIcon from '@material-ui/icons/Place';
import ArchiveIcon from '@material-ui/icons/Archive';
import StarIcon from '@material-ui/icons/Star';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';


import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Popover from '@material-ui/core/Popover';


import './App.css';


import DATA from './data/VideoPageCtrl';
console.log(DATA);

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  popover: {
    pointerEvents: 'none',
    // zIndex: 10000,
  },
  card: {
    // display: 'flex',
    backgroundColor: '#636363',
  },
  details: {
    // display: 'flex',
    // flexDirection: 'column',
  },
  content: {
    // flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  player: {
    flex: '1 0 auto',
  },
  card2: {
    flex: '0 1 auto',
  },
  desc: {
    overflow: 'scroll',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});


class App extends Component {
  state = {
    anchorEl: null,
    anchorEl2: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl2: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl2: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, anchorEl2 } = this.state;
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);

    return (
      <MuiThemeProvider theme={theme}>
      <Paper>
        <Card className={classes.card}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <div>
                <IconButton
                  onMouseEnter={this.handlePopoverOpen}
                  onMouseLeave={this.handlePopoverClose}
                >
                  <KeyboardArrowLeftIcon fontSize="large" />
                </IconButton>
                <Popover
                  id="mouse-over-popover"
                  className={classes.popover}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                  }}
                  open={open2}
                  anchorEl={anchorEl2}
                  onClose={this.handlePopoverClose}
                  disableRestoreFocus
                >
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        style={{
                          width: DATA.ytVideoData.snippet.thumbnails.medium.width,
                          height: DATA.ytVideoData.snippet.thumbnails.medium.height,
                        }}
                        image={DATA.ytVideoData.snippet.thumbnails.default.url}
                      />
                      <CardContent>
                        <Typography component="p" variant="body2">
                          {DATA.ytVideoData.snippet.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Popover>
              </div>
              <ReactPlayer className={classes.player} url={`https://www.youtube.com/watch?v=${DATA.ytVideoData.id}`} />
              <Card className={classes.card2}>
                <CardHeader
                  action={
                    <>
                    <IconButton>
                      <StarIcon />
                    </IconButton>
                    <IconButton>
                      <ArchiveIcon />
                    </IconButton>
                    <IconButton onClick={this.handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                    </>
                  }
                  title={DATA.ytVideoData.snippet.channelTitle}
                  subheader={
                    <List disablePadding>
                      <ListItem>
                        <ListItemIcon>
                          <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText primary={`${DATA.ytVideoData.statistics.viewCount} views`} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PublishIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Published ${DATA.ytVideoData.snippet.publishedAt}`} />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <CameraAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Set a recorded Date" />
                      </ListItem>
                    </List>
                  }
                />
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Add to" />
                  </MenuItem>
                  <MenuItem onClick={this.handleClose}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Manage duplicates" />
                  </MenuItem>
                  <MenuItem onClick={this.handleClose}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Remove" />
                  </MenuItem>

                </Menu>

                <Divider variant="middle" />

                <CardContent>
                  <Typography component="p" variant="body2" className={classes.desc}>
                    {DATA.ytVideoData.snippet.description}
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
            </CardContent>

            <div className={classes.controls}>
              <IconButton aria-label="Previous">
                {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
              </IconButton>
              <IconButton aria-label="Play/pause">
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
              <IconButton aria-label="Next">
                {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
              </IconButton>
            </div>

          </div>
        </Card>
      </Paper>
    </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);

export const AngularVideoTimeline = react2angular(App, []);
window.AngularVideoTimeline =  AngularVideoTimeline;
