import React, { Component } from 'react';
import { react2angular } from 'react2angular';
import styled from 'styled-components';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

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
    anchorEl2: null,
    anchorEl3: null,
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
    const { anchorEl2, anchorEl3 } = this.state;
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);


    let data = DATA;
    if (this.props.$scope) data = this.props.$scope.$parent.ctrl;

    return (
      <MuiThemeProvider theme={theme}>
      <Paper>
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
                <Grid item xs={false} component={styled.div` .popover { pointer-events: none; } `}>
                  <IconButton
                    onMouseEnter={this.handlePopoverOpen}
                    onMouseLeave={this.handlePopoverClose}
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
                    open={open2}
                    anchorEl={anchorEl2}
                    onClose={this.handlePopoverClose}
                    disableRestoreFocus
                  >
                    <PreviewCard data={data} />
                  </Popover>
                </Grid>

                <Grid item xs={7}>
                  <Player data={data}/>
                </Grid>

                <Grid item xs>
                  <InfoCard data={data} />
                </Grid>

                <Grid item xs={false} component={styled.div` .popover { pointer-events: none; } `}>
                  <IconButton
                    onMouseEnter={this.handlePopoverOpen2}
                    onMouseLeave={this.handlePopoverClose2}
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
                    open={open3}
                    anchorEl={anchorEl3}
                    onClose={this.handlePopoverClose2}
                    disableRestoreFocus
                  >
                    <PreviewCard data={data} />
                  </Popover>
                </Grid>

              </Grid>
            </CardContent>

            <Transport />

          </Grid>
        </Card>

        <Timeline />

      </Paper>
    </MuiThemeProvider>
    );
  }
}


export default App;

export const AngularVideoTimeline = react2angular(App, ['foo'], ['$scope', '$http'] );
window.AngularVideoTimeline =  AngularVideoTimeline;
