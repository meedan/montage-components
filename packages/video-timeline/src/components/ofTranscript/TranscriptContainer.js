import React, { Component } from 'react';
import { QueryRenderer, graphql, commitMutation } from 'react-relay';
import qs from 'qs';

import { createEnvironment } from '../../Environment';
import Transcript from '../Transcript';

const environment = createEnvironment();

class TranscriptContainer extends Component {
  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const { ids, currentTime, scrollingContainer, seekTo, transcript, 
      duration, playing, transport, skip, update, timelineOffset } = this.props;



    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query TranscriptContainerQuery($ids: String!) {
            project_media(ids: $ids) {
              tags(first: 10000) {
                edges {
                  node {
                    id
                    fragment
                    tag_text_object {
                      id
                      text
                    }
                  }
                }
              }
            }
          }
        `}
        variables={{ ids }}
        render={({ error, props, retry }) => {
          console.log(error, props);

          if (!error && props) {
            const {
              project_media: {
                tags: { edges = [] },
              },
            } = props;

            const suggestions = [];
            const entities = {};

            edges
              .filter(({ node }) => !!node)
              .forEach(({ node: { id: instance, fragment, tag_text_object } }) => {
                if (!tag_text_object) return;

                const { id, text: name } = tag_text_object;
                if (!fragment) return suggestions.push({ id, name });

                if (!entities[id]) entities[id] = { id, name, project_tag: { id, name }, instances: [] };

                // types: tag, clip, location
                const { t = '0,0', type = 'tag' } = qs.parse(fragment);
                const [start_seconds, end_seconds] = t.split(',').map(n => parseFloat(n));

                entities[id].type = type;
                entities[id].instances.push({ start_seconds, end_seconds, id: instance });
              });

            console.log(entities);
            console.log(Object.values(entities).filter(({ type }) => type === 'tag'));

            // TODO allow tags with same name in different clip,tag,place bin

            return (
              <Transcript
                commentThreads={[]}
                currentTime={currentTime}
                scrollingContainer={scrollingContainer}
                seekTo={seekTo}
                transcript={transcript}
                videoPlaces={[]}
                videoTags={Object.values(entities).filter(({ type }) => type === 'tag')}
              />                
            );
          } else if (!error) {
            return <p>loading…</p>;
          } else {
            console.error(error);
            return <p>Error!</p>;
          }
        }}
      />
    );
  }
}

export default TranscriptContainer;
