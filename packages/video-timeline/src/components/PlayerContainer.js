import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { createEnvironment } from '../Environment';
import Player from './Player';

const environment = createEnvironment();

class PlayerContainer extends Component {
  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const { ids, update, playing } = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query PlayerContainerQuery($ids: String!) {
            project_media(ids: $ids) {
              media {
                url
              }
            }
          }
        `}
        variables={{ ids }}
        render={({ error, props }) => {
          if (!error && props && props.project_media && props.project_media.media) {
            return <Player url={props.project_media.media.url} update={update} playing={playing} />;
          } else if (!error) {
            return <p>loading</p>;
          } else {
            return <p>Error</p>;
          }
        }}
      />
    );
  }
}

export default PlayerContainer;
