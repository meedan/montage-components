import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { Component } from 'react';
import ErrorBoundary from 'react-error-boundary';
import styled from 'styled-components';
import { withSnackbar } from 'notistack';

import { ThemeProvider } from '@montage/ui';

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core/styles';

import PlayerContainer from './components/PlayerContainer';
import VideoMetaContainer from './components/VideoMetaContainer';
// import Preview from './components/Preview';
import Timeline from './components/Timeline';
import TranscriptContainer from './components/ofTranscript/TranscriptContainer';
import Transport from './components/Transport';

import transcripts from './data/transcripts';

const TheatreToggle = styled.div`
  position: absolute;
  right: 8px;
  top: 6px;
  z-index: 1000;
`;

const MontagePlayer = styled.div`
  background: black;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1px;
`;
const MontagePlayerVideo = styled.div`
  flex: 1 1 100%;
`;
const MontagePlayerControls = styled.div`
  flex: 0 0 auto;
  color: white;
`;

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
const Theatre = styled.div`
  background-color: ${grey[100]};
  flex: 0 0 auto;
  width: 100%;
  border-bottom: 1px solid ${grey[200]};
  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 1150px;
  }
`;
const BottomWrapper = styled.div`
  background: white;
  width: 100%;
  position: relative;
  flex: 1 1 100%;
`;

const styles = {
  TabsIndicator: {
    background: '#ff6d01',
  },
};

class App extends Component {
  state = {
    currentTime: 0,
    mode: 'timeline',
    theatre: true,
    transport: null,
    duration: 0,
    playing: false,
  };

  scrollingContainer = null;
  setScrollingContainer = element => (this.scrollingContainer = element);

  seekTo = payload => {
    const time = isNaN(payload) ? payload.seekTo : payload;
    if (this.idleSeekTo) cancelIdleCallback(this.idleSeekTo);
    this.idleSeekTo = requestIdleCallback(() => window.internalPlayer.seekTo(time, true), { timeout: 500 });
    if (payload.transport) this.setState({ transport: payload.transport });
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

  render() {
    const { ids, classes } = this.props;
    const { currentTime, duration, playing, transport } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <ThemeProvider>
          <style scoped>{'.popover { pointer-events: none; }'}</style>
          <Layout>
            <Theatre>
              <div style={{ display: this.state.theatre ? 'block' : 'none' }}>
                <Grid
                  alignItems="center"
                  alignContent="space-between"
                  container
                  justify="center"
                  spacing={0}
                  wrap="nowrap">
                  <Grid item sm={'auto'}>
                    <div style={{ width: '50px' }}>
                      {/* data.prevVideo ? <Preview data={data.prevVideo} isPrev /> : null */}
                    </div>
                  </Grid>
                  <Grid item sm={12}>
                    <Paper square>
                      <Grid container justify="center" alignItems="stretch" spacing={0} direction="row-reverse">
                        <Grid item sm={4}>
                          <ErrorBoundary>
                            <VideoMetaContainer
                              ids={ids}
                              seekTo={payload => this.seekTo(payload)}
                              currentTime={currentTime}
                            />
                          </ErrorBoundary>
                        </Grid>
                        <Grid item sm={8}>
                          <MontagePlayer>
                            <MontagePlayerVideo>
                              <PlayerContainer ids={ids} update={payload => this.setState(payload)} playing={playing} />
                            </MontagePlayerVideo>
                            <MontagePlayerControls>
                              <Transport
                                currentTime={currentTime}
                                transport={transport}
                                seekTo={this.seekTo}
                                playing={playing}
                                update={payload => this.setState(payload)}
                              />
                            </MontagePlayerControls>
                          </MontagePlayer>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item sm={'auto'}>
                    <div style={{ width: '50px' }}>
                      {/* data.nextVideo ? <Preview data={data.nextVideo} isNext /> : null */}
                    </div>
                  </Grid>
                </Grid>
              </div>

              <TheatreToggle>
                <Tooltip title={this.state.theatre ? 'Hide Theatre' : 'Show Theatre'}>
                  <IconButton
                    onClick={() =>
                      this.setState(prevState => ({
                        theatre: !prevState.theatre,
                      }))
                    }>
                    {this.state.theatre ? (
                      <UnfoldLessIcon aria-label="Hide Theatre"></UnfoldLessIcon>
                    ) : (
                      <UnfoldMoreIcon aria-label="Show Theatre"></UnfoldMoreIcon>
                    )}
                  </IconButton>
                </Tooltip>
              </TheatreToggle>

              <Tabs value={this.state.mode} centered classes={{ indicator: classes.TabsIndicator }}>
                <Tab
                  onClick={() => this.setState({ mode: 'transcript' })}
                  label="Transcript"
                  selected={this.state.mode === 'transcript'}
                  classes={{
                    root: classes.Tab,
                    selected: classes.TabSelected,
                  }}
                  value={'transcript'}
                />
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
            </Theatre>
            <BottomWrapper ref={this.setScrollingContainer}>
              {this.state.mode === 'timeline' ? (
                <ErrorBoundary>
                  <Timeline
                    ids={ids}
                    currentTime={currentTime}
                    duration={duration}
                    playing={playing}
                    transport={transport}
                    seekTo={this.seekTo}
                    update={payload => this.setState(payload)}
                  />
                </ErrorBoundary>
              ) : (
                <ErrorBoundary>
                  <TranscriptContainer
                    ids={ids}
                    currentTime={currentTime}
                    scrollingContainer={this.scrollingContainer}
                    seekTo={this.seekTo}
                    transcript={transcripts[0]}
                  />
                </ErrorBoundary>
              )}
            </BottomWrapper>
          </Layout>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withStyles(styles)(withSnackbar(App));
