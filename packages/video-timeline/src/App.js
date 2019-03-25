import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { react2angular } from 'react2angular';
import { SnackbarProvider } from 'notistack';
import DateFnsUtils from '@date-io/date-fns';
import React, { Component } from 'react';
import styled from 'styled-components';

import { MUIThemeProvider } from '@montage/ui';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';

import InfoCard from './components/InfoCard';
import Player from './components/Player';
import Preview from './components/Preview';
import Timeline from './components/Timeline';
import Transport from './components/Transport';

import oldData from './data/VideoPageCtrl';
import oldTimelineData from './data/VideoTimeline';
import newData from './data/newData';
const DATA = {
  ...oldData,
  timelineData: oldTimelineData,

  // Extend with more data missing from Laurian’s export
  gdVideoData: {
    ...oldData.gdVideoData,
    // archived_at: '2019-03-24T16:22:59+00:00',
    in_collections: [81, 82],
  },
  project: {
    ...oldData.project,
    collections: [
      {
        created: '2019-02-27T14:09:55+00:00',
        id: 81,
        modified: '2019-02-27T14:09:55+00:00',
        name: 'A collection',
        project_id: 1161,
      },
      {
        created: '2019-02-27T14:10:57+00:00',
        id: 82,
        modified: '2019-02-27T14:10:57+00:00',
        name: 'Another one',
        project_id: 1161,
      },
      {
        created: '2019-02-27T14:15:05+00:00',
        id: 83,
        modified: '2019-02-27T14:15:05+00:00',
        name: 'Hello',
        project_id: 1161,
      },
    ],
  },

  // Extend with new data missing in the API
  newData,
};

console.group('Data:');
console.log(DATA);
console.groupEnd();

const Top = styled.div`
  background-color: ${grey[600]};
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
    return {};
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
    const { data, currentTime, duration } = this.state;

    return (
      <>
        <SnackbarProvider maxSnack={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CssBaseline />
            <MUIThemeProvider>
              <style scoped>{'.popover { pointer-events: none; }'}</style>
              <Top>
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
                      <Preview data={data.prevVideo} isPrev />
                    ) : null}
                  </Grid>
                  <Grid item sm={12}>
                    <Paper square>
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
                    {data.prevVideo ? (
                      <Preview data={data.nextVideo} isNext />
                    ) : null}
                  </Grid>
                </Grid>
                <Transport
                  currentTime={currentTime}
                  duration={duration}
                  player={this.player}
                  playing={this.state.playing}
                  playPause={() => this.playPause()}
                />
              </Top>
              <Bottom>
                <Timeline
                  currentTime={currentTime}
                  duration={duration}
                  player={this.player}
                />
              </Bottom>
            </MUIThemeProvider>
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
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
