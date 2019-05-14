import { connect } from 'react-redux';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { react2angular } from 'react2angular';
import { SnackbarProvider } from 'notistack';
import DateFnsUtils from '@date-io/date-fns';
import produce from 'immer';
import React, { createRef, Component } from 'react';
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

import hamock from './hamock.png';

// import baseData from './data/baseData';
// import timelineData from './data/timelineData';
// import newData from './data/newData';
//
// const DATA = produce(
//   {
//     ...baseData, // Base data from Laurian’s account
//     ...timelineData, // Base data from Laurian’s account
//     ...newData, // Add new data missing in the API
//     project: {
//       ...baseData.project,
//       projectplaces: [{ id: 2070, name: 'Syria', placeinstance_count: 1 }],
//       projectclips: [{ id: 2070, name: 'Shareable', clipinstance_count: 1 }],
//     },
//   },
//   () => {}
// );
//
// console.group('Data:');
// console.log(DATA);
// console.groupEnd();

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
  padding-left: 50px;
  padding-right: 50px;
  width: 100%;
`;
const TimelineWrapper = styled.div`
  border-left: 1px solid ${grey[300]};
  border-right: 1px solid ${grey[300]};
  margin-left: auto;
  margin-right: auto;
  max-width: 1500px;
  min-height: 500px;
  padding-bottom: 300px;
  position: relative;
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
  timelineRef = createRef();

  state = {
    anchorElNext: null,
    anchorElPrev: null,
    // data: DATA,
    map: false,
    mode: 'timeline',
  };

  // static getDerivedStateFromProps(props, state) {
  //   // FIXME:
  //   // if (props.$scope) {
  //   //   const data = props.$scope.$parent.ctrl;
  //   //   return {
  //   //     data,
  //   //     duration: data.gdVideoData.duration,
  //   //   };
  //   // }
  //
  //   return {};
  // }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  };
  componentWillUnmount = () => {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  };

  updateDimensions = () => {
    const rect = this.timelineRef.current;
    if (!rect) return null;
    const rectBox = rect.getBoundingClientRect();
    this.setState({
      timelineBox: {
        height: rectBox.height,
        width: rectBox.width,
        x1: rectBox.x,
        x2: rectBox.x + rectBox.width,
        y1: rectBox.y,
        y2: rectBox.y + rectBox.height,
      },
    });
  };

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

  setMap = map => {
    this.setState({ map });
  };

  render() {
    // const { classes, player } = this.props;
    const { data, classes, player } = this.props;
    const { currentTime, duration, playing, transport } = player;
    // const { data, map } = this.state;
    const { map } = this.state;

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
                              map={map}
                              setMap={this.setMap}
                            />
                          </Grid>
                          <Grid item sm={8}>
                            <Player data={data} player={player} />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item sm={'auto'}>
                      {data.nextVideo ? (
                        <Preview data={data.nextVideo} isNext />
                      ) : null}
                    </Grid>
                  </Grid>
                  <Transport
                    currentTime={currentTime}
                    duration={duration}
                    player={this.props.player}
                    transport={transport}
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
                    <TimelineWrapper ref={this.timelineRef}>
                      <Timeline
                        box={this.state.timelineBox}
                        currentTime={currentTime}
                        transport={transport}
                        data={data}
                        duration={duration}
                        playing={playing}
                      />
                    </TimelineWrapper>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <img
                        alt=""
                        src={hamock}
                        style={{ margin: '0 auto' }}
                        width="1024px"
                      />
                    </div>
                  )}
                </BottomWrapper>
              </Layout>
            </MUIThemeProvider>
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </>
    );
  }
}

// export default withStyles(styles)(App);
export default connect(({ player, data }) => ({ player, data }))(withStyles(styles)(App));

// FIXME:
export const AngularVideoTimeline = react2angular(
  App,
  ['foo'],
  ['$scope', '$http']
);
window.AngularVideoTimeline = AngularVideoTimeline;
