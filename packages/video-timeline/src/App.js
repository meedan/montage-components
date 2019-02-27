import React, { Component } from 'react';
import { react2angular } from 'react2angular';
// import styled from 'styled-components';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

import { Container } from '@montage/ui';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import IconButton from '@material-ui/core/IconButton';

import Popover from '@material-ui/core/Popover';

import PreviewCard from './components/PreviewCard';
import Player from './components/Player';
import InfoCard from './components/InfoCard';
import Transport from './components/Transport';
import Timeline from './components/Timeline';

import DATA from './data/VideoPageCtrl';
console.log(DATA);

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
      <MuiThemeProvider theme={theme}>
        <Paper>
          <style scoped>{'.popover { pointer-events: none; }'}</style>
          <Card>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center"
              spacing={0}
            >
              <CardContent>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="stretch"
                  spacing={0}
                >
                  <Grid item xs={false}>
                    {data.prevVideo ? (
                      <>
                        <IconButton
                          onMouseEnter={this.handlePopoverPrevOpen}
                          onMouseLeave={this.handlePopoverPrevClose}
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

                  <Grid item xs={7}>
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

                  <Grid item xs>
                    <InfoCard data={data} />
                  </Grid>

                  <Grid item xs={false}>
                    {data.nextVideo ? (
                      <>
                        <IconButton
                          onMouseEnter={this.handlePopoverNextOpen}
                          onMouseLeave={this.handlePopoverNextClose}
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
              </CardContent>

              <Transport
                playing={this.state.playing}
                currentTime={currentTime}
                duration={duration}
                player={this.player}
                playPause={() => this.playPause()}
              />
            </Grid>
          </Card>

          <Container>DOES IT?!</Container>

          <Timeline
            currentTime={currentTime}
            duration={duration}
            player={this.player}
          />
        </Paper>
      </MuiThemeProvider>
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
