import { connect } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { Component } from 'react';
import ErrorBoundary from 'react-error-boundary';
import styled from 'styled-components';
import { withSnackbar } from 'notistack';

import { ThemeProvider, VideoMeta } from '@montage/ui';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import Player from './components/Player';
import Preview from './components/Preview';
import Timeline from './components/Timeline';
import Transport from './components/Transport';

import Transcript from './components/transcript/Transcript';

import { update } from './reducers/player';

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
  state = {
    currentTime: 0,
    anchorElNext: null,
    anchorElPrev: null,
    mode: 'timeline',
  };

  scrollingContainer = null;
  setScrollingContainer = element => (this.scrollingContainer = element);

  setCurrentTime = currentTime => this.setState({ currentTime });

  seekTo = payload => {
    const time = isNaN(payload) ? payload.seekTo : payload;
    if (this.idleSeekTo) cancelIdleCallback(this.idleSeekTo);
    this.idleSeekTo = requestIdleCallback(() => window.internalPlayer.seekTo(time, true), { timeout: 500 });
    if (payload.transport) this.props.update({ transport: payload.transport });
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
    const { data, classes, player } = this.props;
    const { currentTime } = this.state;
    const { duration, playing, transport } = player;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <ThemeProvider>
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
                  {data.prevVideo ? <Preview data={data.prevVideo} isPrev /> : null}
                </Grid>
                <Grid item sm={12}>
                  <Paper square>
                    <Grid container justify="center" alignItems="stretch" spacing={0} direction="row-reverse">
                      <Grid item sm={4}>
                        <VideoMeta
                          allocation={['collectionId1', 'collectionId2']}
                          collections={[
                            {
                              name: 'A collection',
                              id: 'collectionId1',
                            },
                            {
                              name: 'Another collection',
                              id: 'collectionId2',
                            },
                            {
                              name: 'Third collection',
                              id: 'collectionId3',
                            },
                          ]}
                          onCreateCollection={str => console.log('onCreateCollection()', str)}
                          onDelete={() => console.log('onDelete()')}
                          onTriggerDelete={() => console.log('onTriggerDelete()')}
                          onManageDupes={() => console.log('onManageDupes()')}
                          onUpdateAllocation={arr => console.log('onUpdateAllocation()', arr)}
                          currentTime={currentTime}
                          videoPlaces={data.videoPlaces}
                          pubDate={data.ytVideoData.snippet.publishedAt}
                          channelTitle={data.ytVideoData.snippet.channelTitle}
                          videoViewCount={data.ytVideoData.statistics.viewCount}
                          videoId={data.gdVideoData.id}
                          videoDescription={data.ytVideoData.snippet.description}
                          videoBackups={data.videoBackups}
                          onTriggerArchive={(payload, callback) => {
                            console.log('onTriggerArchive, payload:', payload);
                            setTimeout(() => {
                              this.props.enqueueSnackbar('Video archived');
                              callback();
                            }, 1000);
                          }}
                          onTriggerKeep={callback => {
                            console.log('onTriggerKeep');
                            setTimeout(() => {
                              this.props.enqueueSnackbar('Syncing with Keep finished');
                              callback();
                            }, 2000);
                          }}
                          onTriggerFavourite={(payload, callback) => {
                            console.log('onTriggerFavourite, payload:', payload);
                            // ;
                            setTimeout(() => {
                              this.props.enqueueSnackbar('Video added to favourites');
                              callback();
                            }, 1000);
                          }}
                          //
                          onRecDateChange={(date, callback) => {
                            console.log(date);
                            callback();
                          }}
                          recDateOverriden={data.gdVideoData.recorded_date_overridden}
                          seekTo={payload => this.seekTo(payload)}
                        />
                      </Grid>
                      <Grid item sm={8}>
                        <Player data={data} player={player} onProgress={this.setCurrentTime}/>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item sm={'auto'}>
                  {data.nextVideo ? <Preview data={data.nextVideo} isNext /> : null}
                </Grid>
              </Grid>
              <Transport
                currentTime={currentTime}
                duration={duration}
                player={this.props.player}
                transport={transport}
                seekTo={this.seekTo}
              />
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
            </TopWrapper>
            <BottomWrapper ref={this.setScrollingContainer}>
              {this.state.mode === 'timeline' ? (
                <ErrorBoundary>
                  <Timeline
                    currentTime={currentTime}
                    data={data}
                    duration={duration}
                    playing={playing}
                    transport={transport}
                    seekTo={this.seekTo}
                  />
                </ErrorBoundary>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Transcript
                    commentThreads={data.commentThreads}
                    videoTags={data.videoTags}
                    videoPlaces={data.videoPlaces}
                    scrollingContainer={this.scrollingContainer}
                    transcript={data.transcripts[0]}
                    currentTime={currentTime}
                    seekTo={this.seekTo}
                  />
                </div>
              )}
            </BottomWrapper>
          </Layout>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default connect(
  ({ player, data }) => ({ player, data }), { update })(withStyles(styles)(withSnackbar(App)));
