import React, { Component } from 'react';
import { react2angular } from 'react2angular';
import styled from 'styled-components';

import ReactPlayer from 'react-player';

import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
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
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import VideoCallIcon from '@material-ui/icons/VideoCall';
// import LabelIcon from '@material-ui/icons/Label';
// import CommentIcon from '@material-ui/icons/Comment';
import DragHandleIcon from '@material-ui/icons/DragHandle';


import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Popover from '@material-ui/core/Popover';

import Collapse from '@material-ui/core/Collapse';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Slider from 'rc-slider';


import 'rc-slider/assets/index.css';
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
  },
  card: {
    backgroundColor: '#636363',
  },
  playerWrapper: {
    // position: 'relative',
    // paddingTop: '56.25%',
  },
  player: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
});


class App extends Component {
  state = {
    anchorEl: null,
    anchorEl2: null,
    anchorEl3: null,
    collapsedRow: true,
    collapsedRow2: true
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

  handlePopoverOpen2 = event => {
    this.setState({ anchorEl3: event.currentTarget });
  };

  handlePopoverClose2 = () => {
    this.setState({ anchorEl3: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, anchorEl2, anchorEl3 } = this.state;
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    let data = DATA;
    if (this.props.$scope) data = this.props.$scope.$parent.ctrl;

    return (
      <MuiThemeProvider theme={theme}>
      <Paper>
        <Card className={classes.card}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing={0}
          >
            <CardContent className={classes.content}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="stretch"
              spacing={0}
            >
              <Grid item xs={false}>
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
                          width: data.ytVideoData.snippet.thumbnails.medium.width,
                          height: data.ytVideoData.snippet.thumbnails.medium.height,
                        }}
                        image={data.ytVideoData.snippet.thumbnails.default.url}
                      />
                      <CardContent>
                        <Typography component="p" variant="body2">
                          Previous video description
                          { /* data.ytVideoData.snippet.description */ }
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Popover>
              </Grid>

              <Grid item xs={7} className={classes.playerWrapper}>
                <ReactPlayer
                  className={classes.player} url={`https://www.youtube.com/watch?v=${data.ytVideoData.id}`}
                  controls
                  width='100%'
                  height='100%'
                />
              </Grid>

              <Grid item xs>
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
                    title={data.ytVideoData.snippet.channelTitle}
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

                  <List disablePadding>
                    <ListItem>
                      <ListItemIcon>
                        <VisibilityIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${data.ytVideoData.statistics.viewCount} views`} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PublishIcon />
                      </ListItemIcon>
                      <ListItemText primary={`Published ${data.ytVideoData.snippet.publishedAt}`} />
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
                    <Typography component="p" variant="body2" className={classes.desc}>
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
              </Grid>

              <Grid item xs={false}>
                <IconButton
                  onMouseEnter={this.handlePopoverOpen2}
                  onMouseLeave={this.handlePopoverClose2}
                >
                  <KeyboardArrowRightIcon fontSize="large" />
                </IconButton>
                <Popover
                  id="mouse-over-popover2"
                  className={classes.popover}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  open={open3}
                  anchorEl={anchorEl3}
                  onClose={this.handlePopoverClose2}
                  disableRestoreFocus
                >
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        style={{
                          width: data.ytVideoData.snippet.thumbnails.medium.width,
                          height: data.ytVideoData.snippet.thumbnails.medium.height,
                        }}
                        image={data.ytVideoData.snippet.thumbnails.default.url}
                      />
                      <CardContent>
                        <Typography component="p" variant="body2">
                          Next video description
                          { /* data.ytVideoData.snippet.description */ }
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Popover>
              </Grid>

            </Grid>
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

          </Grid>
        </Card>


        <Table component={styled.table`
            thead {
              tr, th, td {
                padding: 0 !important;
                height: 0 !important;
                border: 0;
              }
            }

            tbody {
              tr {
                th, td {
                  border-bottom: none;
                }
                &:first-child {
                  th, td {
                    border-top: 1px solid blue;
                  }
                }
              }
              td:nth-child(2), td:nth-child(3) {
                padding: 0;
                border-left: 1px solid blue;
              }
            }

            thead + tbody, tbody + tbody.Detail  {
              tr:first-child {
                th, td {
                  border-top: none;
                }
              }
            }
          `}>
          <TableHead >
            <TableRow>
              <TableCell component="th" scope="row"></TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[90]}
                  pushable
                  trackStyle={[{ backgroundColor: 'transparent' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                  handleStyle={{
                    borderColor: 'orange',
                    backgroundColor: 'orange',
                  }}
                />
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row"
                hover
                style={{cursor: 'pointer'}}
                onClick={() => this.setState({collapsedRow: !this.state.collapsedRow} )}
              >
                Tag Group
              </TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[90, 143, 363, 600]}
                  pushable
                  trackStyle={[{ backgroundColor: 'darkgrey' }, { backgroundColor: 'transparent' }, { backgroundColor: 'darkgrey' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton disableRipple>
                  <DragHandleIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>

          { this.state.collapsedRow ? null :
          <TableBody className="Detail">
            <TableRow>
              <TableCell component="th" scope="row" >
                Tag1
              </TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[93, 123, 393, 400]}
                  pushable
                  trackStyle={[{ backgroundColor: 'darkgrey' }, { backgroundColor: 'transparent' }, { backgroundColor: 'darkgrey' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Tag2
              </TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[363, 390]}
                  pushable
                  trackStyle={[{ backgroundColor: 'darkgrey' }, { backgroundColor: 'transparent' }, { backgroundColor: 'darkgrey' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody>
          }



          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row"
                hover
                style={{cursor: 'pointer'}}
                onClick={() => this.setState({collapsedRow2: !this.state.collapsedRow2} )}
              >
                Tag Group X
              </TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[90, 143, 363, 600]}
                  pushable
                  trackStyle={[{ backgroundColor: 'darkgrey' }, { backgroundColor: 'transparent' }, { backgroundColor: 'darkgrey' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton disableRipple>
                  <DragHandleIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>

          { this.state.collapsedRow2 ? null :
          <TableBody className="Detail">
            <TableRow>
              <TableCell component="th" scope="row" >
                TagA
              </TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[93, 123, 393, 400]}
                  pushable
                  trackStyle={[{ backgroundColor: 'darkgrey' }, { backgroundColor: 'transparent' }, { backgroundColor: 'darkgrey' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                TagB
              </TableCell>
              <TableCell align="right" style={{ width: '100%' }}>
                <Range
                  style={{ width: '100%' }}
                  min={0}
                  max={2000}
                  defaultValue={[363, 390]}
                  pushable
                  trackStyle={[{ backgroundColor: 'darkgrey' }, { backgroundColor: 'transparent' }, { backgroundColor: 'darkgrey' }]}
                  railStyle={{ backgroundColor: 'transparent' }}
                />
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody>
          }

        </Table>

      </Paper>
    </MuiThemeProvider>
    );
  }
}


export default withStyles(styles, { withTheme: true })(App);

export const AngularVideoTimeline = react2angular( withStyles(styles, { withTheme: true })(App), ['foo'], ['$scope', '$http'] );
window.AngularVideoTimeline =  AngularVideoTimeline;
