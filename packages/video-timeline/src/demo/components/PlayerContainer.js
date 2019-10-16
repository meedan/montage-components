import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { createEnvironment } from './Environment';
import Player from './Player';

/*
<Player
  data={data}
  player={player}
  onProgress={this.setCurrentTime}
/>
*/

class PlayerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const environment = createEnvironment();

    const { data, player, onProgress } = this.props;

    const loc = window.location.search.split(/[=&]/);

    return (
      <div>
        <QueryRenderer environment={environment}
          query={graphql`
            query PlayerContainerQuery($ids: String!) {
              project_media(ids: $ids) {
                media {
                  url
                }
              }
            }
          `}

          variables={{
            ids: [loc[3], loc[1]].join(','),
          }}

          render={({error, props}) => {
            if (!error && props && props.project_media && props.project_media.media) {
              return (
                <Player
                  url={props.project_media.media.url}
                  data={data}
                  player={player}
                  onProgress={onProgress}
                />
              );
            }
            else {
              return (<p>Error</p>);
            }
          }}
        />
      </div>
    );
  }
}

export default PlayerContainer;
