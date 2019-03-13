import { react2angular } from 'react2angular';
import styled from 'styled-components';
import React, { Component } from 'react';

import { MUIThemeProvider } from '@montage/ui';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import grey from '@material-ui/core/colors/grey';

import PreviewCard from './components/PreviewCard';
import Player from './components/Player';
import InfoCard from './components/InfoCard';
import Transport from './components/Transport';
import Timeline from './components/Timeline';

import DATA from './data/VideoPageCtrl';
console.log(DATA);

const Top = styled.div`
  background-color: ${grey[700]};
  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 1150px;
  }
`;
const Bottom = styled.div``;

class App extends Component {
  state = {
    anchorElPrev: null,
    anchorElNext: null,
    currentTime: 0,
    playing: false,
    duration: DATA.gdVideoData.duration,
    data: DATA, // sample data
  };

  static getDerivedStateFromProps(props, state) {
    if (props.$scope) {
      const data = props.$scope.$parent.ctrl;
      return {
        data,
        duration: data.gdVideoData.duration,
      };
    }
  }

  handlePopoverPrevOpen = event => {
    this.setState({ anchorElPrev: event.currentTarget });
  };

  handlePopoverPrevClose = () => {
    this.setState({ anchorElPrev: null });
  };

  handlePopoverNextOpen = event => {
    this.setState({ anchorElNext: event.currentTarget });
  };

  handlePopoverNextClose = () => {
    this.setState({ anchorElNext: null });
  };

  setPlayer = player => {
    this.player = player;
  };

  playPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  stop = () => {
    this.setState({ playing: false });
  };

  onDuration = duration => {
    this.setState({ duration });
  };

  onProgress = progress => {
    this.setState({ currentTime: progress.playedSeconds });
  };

  onPlay = () => {
    this.setState({ playing: true });
  };

  onPause = () => {
    this.setState({ playing: false });
  };

  render() {
    const {
      data,
      currentTime,
      duration,
      anchorElPrev,
      anchorElNext,
    } = this.state;
    const openPrev = Boolean(anchorElPrev);
    const openNext = Boolean(anchorElNext);

    return (
      <>
        <CssBaseline />
        <MUIThemeProvider>
          <style scoped>{'.popover { pointer-events: none; }'}</style>
          <Top>
            <div>
              <Grid
                alignItems="center"
                alignContent="space-between"
                container
                justify="center"
                spacing={0}
                wrap="nowrap"
              >
                <Grid item sm={'auto'}>
                  {data.prevVideo ? (
                    <>
                      <IconButton
                        onMouseEnter={this.handlePopoverPrevOpen}
                        onMouseLeave={this.handlePopoverPrevClose}
                        color="secondary"
                      >
                        <KeyboardArrowLeftIcon fontSize="large" />
                      </IconButton>
                      <Popover
                        className="popover"
                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'center',
                          horizontal: 'left',
                        }}
                        open={openPrev}
                        anchorEl={anchorElPrev}
                        onClose={this.handlePopoverPrevClose}
                        disableRestoreFocus
                      >
                        <PreviewCard data={data.prevVideo} />
                      </Popover>
                    </>
                  ) : null}
                </Grid>
                <Grid item sm={12}>
                  <Paper>
                    <Grid
                      container
                      justify="center"
                      alignItems="stretch"
                      spacing={0}
                      direction="row-reverse"
                    >
                      <Grid item sm={4}>
                        <InfoCard data={data} />
                      </Grid>
                      <Grid item sm={8}>
                        <Player
                          data={data}
                          onProgress={this.onProgress}
                          onDuration={this.onDuration}
                          setPlayer={this.setPlayer}
                          playing={this.state.playing}
                          onPlay={() => this.onPlay()}
                          onPause={() => this.onPause()}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item sm={'auto'}>
                  {data.nextVideo ? (
                    <>
                      <IconButton
                        onMouseEnter={this.handlePopoverNextOpen}
                        onMouseLeave={this.handlePopoverNextClose}
                        color="secondary"
                      >
                        <KeyboardArrowRightIcon fontSize="large" />
                      </IconButton>
                      <Popover
                        className="popover"
                        anchorOrigin={{
                          vertical: 'center',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'center',
                          horizontal: 'right',
                        }}
                        open={openNext}
                        anchorEl={anchorElNext}
                        onClose={this.handlePopoverNextClose}
                        disableRestoreFocus
                      >
                        <PreviewCard data={data.nextVideo} />
                      </Popover>
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </div>
            <div>
              <Transport
                playing={this.state.playing}
                currentTime={currentTime}
                duration={duration}
                player={this.player}
                playPause={() => this.playPause()}
              />
            </div>
          </Top>
          <Bottom>
            <Timeline
              currentTime={currentTime}
              duration={duration}
              player={this.player}
            />
          </Bottom>
        </MUIThemeProvider>
      </>
    );
  }
}

export default App;

export const AngularVideoTimeline = react2angular(
  App,
  ['foo'],
  ['$scope', '$http']
);
window.AngularVideoTimeline = AngularVideoTimeline;
