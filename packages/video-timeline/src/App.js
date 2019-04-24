import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { react2angular } from 'react2angular';
import { SnackbarProvider } from 'notistack';
import DateFnsUtils from '@date-io/date-fns';
import React, { Component } from 'react';

import produce from 'immer';

import styled from 'styled-components';

import { MUIThemeProvider } from '@montage/ui';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import InfoCard from './components/InfoCard';
import Player from './components/Player';
import Preview from './components/Preview';
import Timeline from './components/Timeline';
import Transport from './components/Transport';

import baseData from './data/baseData';
import timelineData from './data/timelineData';
import moreData from './data/moreData';
import newData from './data/newData';

const DATA = produce(
  {
    ...baseData, // Base data from Laurian’s account
    ...timelineData, // Base data from Laurian’s account
    ...moreData, // Extend with more data missing from Laurian’s export
    ...newData, // Add new data missing in the API
    project: {
      ...baseData.project,
      projectplaces: [{ id: 2070, name: 'Syria', placeinstance_count: 1 }],
      projectclips: [{ id: 2070, name: 'Shareable', clipinstance_count: 1 }],
    },
  },
  () => {}
);

// const DATA = {
//   ...baseData, // Base data from Laurian’s account
//   ...timelineData, // Base data from Laurian’s account
//   ...moreData, // Extend with more data missing from Laurian’s export
//   newData, // Add new data missing in the API
// };

console.group('Data:');
console.log(DATA);
console.groupEnd();

const Layout = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;
const TopWrapper = styled.div`
  background-color: ${grey[600]};
  flex: 0 0 auto;
  width: 100%;
  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 1150px;
  }
`;
const BottomWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
`;
const TimelineWrapper = styled.div`
  border-left: 1px solid ${grey[300]};
  border-right: 1px solid ${grey[300]};
  margin-left: auto;
  margin-right: auto;
  max-width: 1600px;
  min-height: 500px;
  padding-bottom: 260px;
  position: relative;
  &:before {
    border-left: 1px solid ${grey[300]};
    content: ' ';
    display: block;
    height: 100%;
    left: 224px;
    min-height: 500px;
    pointer-events: none;
    position: absolute;
    width: 1px;
    z-index: 1;
  }
`;

const styles = {
  Tab: {
    color: 'white',
  },
  TabSelected: {
    borderColor: 'white',
    color: 'white',
  },
  TabsIndicator: {
    background: 'white',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    anchorElPrev: null,
    anchorElNext: null,
    currentTime: 0,
    playing: false,
    duration: DATA.gdVideoData.duration,
    data: DATA,
    mode: 'timeline',
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
    this.setState({
      currentTime: progress.playedSeconds,
    });
  };

  onPlay = () => {
    this.setState({ playing: true });
  };

  onPause = () => {
    this.setState({ playing: false });
  };

  render() {
    const { data, currentTime, duration } = this.state;
    const { classes } = this.props;

    return (
      <>
        <SnackbarProvider maxSnack={3}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CssBaseline />
            <MUIThemeProvider>
              <style scoped>{'.popover { pointer-events: none; }'}</style>
              <Layout>
                <TopWrapper>
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
                            <InfoCard
                              data={data}
                              currentTime={currentTime}
                              player={this.player}
                            />
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
                  <Tabs
                    value={this.state.mode}
                    centered
                    classes={{ indicator: classes.TabsIndicator }}
                  >
                    <Tab
                      onClick={() => this.setState({ mode: 'transcript' })}
                      label="Transcript"
                      selected={this.state.mode === 'transcript'}
                      classes={{
                        root: classes.Tab,
                        selected: classes.TabSelected,
                      }}
                      value={'transcript'}
                    >
                      Transcript
                    </Tab>
                    <Tab
                      onClick={() => this.setState({ mode: 'timeline' })}
                      selected={this.state.mode === 'timeline'}
                      label="Timeline"
                      classes={{
                        root: classes.Tab,
                        selected: classes.TabSelected,
                      }}
                      value={'timeline'}
                    />
                  </Tabs>
                </TopWrapper>
                <BottomWrapper>
                  {this.state.mode === 'timeline' ? (
                    <TimelineWrapper>
                      <Timeline
                        currentTime={currentTime}
                        data={data}
                        duration={duration}
                        onPause={() => this.onPause()}
                        onPlay={() => this.onPlay()}
                        player={this.player}
                        playing={this.state.playing}
                        playPause={() => this.playPause()}
                      />
                    </TimelineWrapper>
                  ) : null}
                </BottomWrapper>
              </Layout>
            </MUIThemeProvider>
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </>
    );
  }
}

export default withStyles(styles)(App);

export const AngularVideoTimeline = react2angular(
  App,
  ['foo'],
  ['$scope', '$http']
);
window.AngularVideoTimeline = AngularVideoTimeline;
